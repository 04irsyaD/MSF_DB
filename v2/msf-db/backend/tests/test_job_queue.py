"""
Test job queue state machine — memastikan lifecycle job berjalan benar.
"""
import pytest
import asyncio
from app.background.job_queue import job_queue, JobStatus


@pytest.mark.asyncio
async def test_create_job_returns_id():
    job = job_queue.create_job(
        project_name="Test",
    )
    assert isinstance(job.job_id, str)
    assert len(job.job_id) > 0


@pytest.mark.asyncio
async def test_new_job_status_is_queued():
    job = job_queue.create_job(
        project_name="Test",
    )
    fetched_job = job_queue.get_job(job.job_id)
    assert fetched_job is not None
    assert fetched_job.status == JobStatus.QUEUED


@pytest.mark.asyncio
async def test_cancel_queued_job():
    job = job_queue.create_job(
        project_name="Test",
    )
    success = await job_queue.cancel_job(job.job_id)
    assert success is True

    fetched_job = job_queue.get_job(job.job_id)
    assert fetched_job.status == JobStatus.CANCELLED


@pytest.mark.asyncio
async def test_get_nonexistent_job_returns_none():
    job = job_queue.get_job("nonexistent-job-id-12345")
    assert job is None
