"""Reviews are submitted by the public and moderated by an admin.

The moderation queue and the reviewers' email addresses must stay on the admin
side of the fence.
"""
from __future__ import annotations

import pytest

pytestmark = pytest.mark.anyio

REVIEW = {
    "user_name": "Anita Sharma",
    "user_email": "anita@example.com",
    "rating": 5,
    "text": "Beautiful mala, the fragrance is genuine.",
}


async def _submit(client, **overrides):
    response = await client.post("/api/v1/reviews", json={**REVIEW, **overrides})
    assert response.status_code == 201, response.text
    return response.json()


async def test_a_submitted_review_starts_unapproved(client):
    assert (await _submit(client))["status"] == "pending"


async def test_a_submitter_cannot_self_approve(client):
    """status is not part of ReviewCreate; sending it must not take effect."""
    created = await _submit(client, status="approved", featured_on_home=True)
    assert created["status"] == "pending"
    assert created["featured_on_home"] is False


async def test_the_public_list_hides_pending_reviews(client):
    await _submit(client)
    response = await client.get("/api/v1/reviews")
    assert response.status_code == 200
    assert response.json() == []


async def test_the_public_list_cannot_be_asked_for_pending_reviews(client):
    await _submit(client)
    response = await client.get("/api/v1/reviews", params={"status_filter": "pending"})
    assert response.status_code == 200
    assert response.json() == []


async def test_the_public_list_never_exposes_reviewer_emails(client, auth_headers):
    created = await _submit(client)
    await client.put(
        f"/api/v1/reviews/{created['id']}",
        json={"status": "approved"},
        headers=auth_headers,
    )

    response = await client.get("/api/v1/reviews")
    (review,) = response.json()
    assert review["user_name"] == "Anita Sharma"
    assert "user_email" not in review


async def test_the_admin_list_does_show_reviewer_emails(client, auth_headers):
    await _submit(client)
    response = await client.get("/api/v1/reviews/admin/all", headers=auth_headers)
    assert response.status_code == 200
    (review,) = response.json()
    assert review["user_email"] == "anita@example.com"


async def test_the_admin_list_is_closed_to_anonymous_callers(client):
    assert (await client.get("/api/v1/reviews/admin/all")).status_code == 401


async def test_a_rating_outside_one_to_five_is_rejected(client):
    for rating in (0, 6, -3):
        response = await client.post(
            "/api/v1/reviews", json={**REVIEW, "rating": rating}
        )
        assert response.status_code == 422, f"rating={rating} was accepted"


async def test_enquiries_are_closed_to_anonymous_callers(client):
    """Enquiries hold customer name, mobile and email."""
    assert (await client.get("/api/v1/enquiries")).status_code == 401
