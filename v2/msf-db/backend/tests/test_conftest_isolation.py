"""Membuktikan setiap test mendapat job_queue yang bersih."""


def test_a_membuat_job(isolated_job_queue):
    isolated_job_queue.create_job(project_name="Test A")
    assert len(isolated_job_queue.list_jobs()) == 1


def test_b_tidak_melihat_job_dari_test_a(isolated_job_queue):
    assert isolated_job_queue.list_jobs() == []


def test_router_memakai_instance_yang_sama(isolated_job_queue):
    import app.routers.admin as admin_router
    import app.routers.generate as generate_router

    assert generate_router.job_queue is isolated_job_queue
    assert admin_router.job_queue is isolated_job_queue
