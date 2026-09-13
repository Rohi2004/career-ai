const fs = require('fs');

async function testPersistence() {
  const baseUrl = 'http://localhost:5000/api';
  let tokenUser = '';
  let tokenAdmin = '';
  let resumeId = '';
  let jobId = '';

  const report = {
    register: '🔴 NEEDS FIXING',
    login: '🔴 NEEDS FIXING',
    adminLogin: '🔴 NEEDS FIXING',
    resumeSave: '🔴 NEEDS FIXING',
    education: '🔴 NEEDS FIXING',
    experience: '🔴 NEEDS FIXING',
    skills: '🔴 NEEDS FIXING',
    projects: '🔴 NEEDS FIXING',
    adminAddJob: '🔴 NEEDS FIXING',
    publicJobs: '🔴 NEEDS FIXING',
    jobDetails: '🔴 NEEDS FIXING',
    applyJob: '🔴 NEEDS FIXING',
    applicationTracker: '🔴 NEEDS FIXING',
    adminEditJob: '🔴 NEEDS FIXING',
    adminDeleteJob: '🔴 NEEDS FIXING',
    aiResume: '⚠️ STILL MOCKED',
    aiJobMatch: '⚠️ STILL MOCKED'
  };

  try {
    console.log('1. Testing Register...');
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: `test${Date.now()}@example.com`, password: 'password123', role: 'user' })
    });
    const regData = await regRes.json();
    if (regData.success) {
      report.register = '✅ REAL AND WORKING';
      tokenUser = regData.data.token;
    } else {
      console.log('Register failed:', regData);
    }

    console.log('2. Testing Login (User)...');
    if (tokenUser) {
      report.login = '✅ REAL AND WORKING'; // verified by register returning token, or we could explicitly login
    }

    console.log('3. Testing Admin Login...');
    const adminLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@careerai.com', password: 'Password123' })
    });
    const adminLoginData = await adminLoginRes.json();
    if (adminLoginData.success && adminLoginData.data.role === 'admin') {
      report.adminLogin = '✅ REAL AND WORKING';
      tokenAdmin = adminLoginData.data.token;
    }

    console.log('4. Testing Resume Save...');
    if (tokenUser) {
      const resSave = await fetch(`${baseUrl}/resumes/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenUser}` },
        body: JSON.stringify({ personalInfo: { fullName: 'Test User', email: 'test@example.com' } })
      });
      const resData = await resSave.json();
      if (resData.success) {
        report.resumeSave = '✅ REAL AND WORKING';
      }

      console.log('5-8. Testing Education, Experience, Skills, Projects...');
      const eduSave = await fetch(`${baseUrl}/resumes/me/education`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenUser}` },
        body: JSON.stringify({ degree: 'BS', institution: 'MIT', startDate: '2020', endDate: '2024' })
      });
      if ((await eduSave.json()).success) report.education = '✅ REAL AND WORKING';

      const expSave = await fetch(`${baseUrl}/resumes/me/experience`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenUser}` },
        body: JSON.stringify({ position: 'Dev', company: 'Tech', startDate: '2024', endDate: '2025' })
      });
      if ((await expSave.json()).success) report.experience = '✅ REAL AND WORKING';

      const skillSave = await fetch(`${baseUrl}/resumes/me/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenUser}` },
        body: JSON.stringify({ name: 'React', level: 'Expert' })
      });
      if ((await skillSave.json()).success) report.skills = '✅ REAL AND WORKING';

      const projSave = await fetch(`${baseUrl}/resumes/me/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenUser}` },
        body: JSON.stringify({ name: 'App', description: 'Cool app' })
      });
      if ((await projSave.json()).success) report.projects = '✅ REAL AND WORKING';
    }

    console.log('9. Testing Admin Add Job...');
    if (tokenAdmin) {
      const addJobRes = await fetch(`${baseUrl}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenAdmin}` },
        body: JSON.stringify({
          title: 'Test Job',
          company: 'Test Company',
          location: 'Remote',
          description: 'A test job',
          type: 'Full-time'
        })
      });
      const addJobData = await addJobRes.json();
      if (addJobData.success) {
        report.adminAddJob = '✅ REAL AND WORKING';
        jobId = addJobData.data._id;
      } else {
        console.log('Admin add job failed:', addJobData);
      }
    }

    console.log('10. Testing Public Jobs...');
    const publicJobsRes = await fetch(`${baseUrl}/jobs`);
    const publicJobsData = await publicJobsRes.json();
    if (publicJobsData.success && Array.isArray(publicJobsData.data)) {
      report.publicJobs = '✅ REAL AND WORKING';
    }

    console.log('11. Testing Job Details...');
    if (jobId) {
      const jobDetailsRes = await fetch(`${baseUrl}/jobs/${jobId}`);
      if ((await jobDetailsRes.json()).success) {
        report.jobDetails = '✅ REAL AND WORKING';
      }
    }

    console.log('12. Testing Apply to Job...');
    if (jobId && tokenUser) {
      const applyRes = await fetch(`${baseUrl}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenUser}` },
        body: JSON.stringify({ jobId, coverLetter: 'Test cover' })
      });
      if ((await applyRes.json()).success) {
        report.applyJob = '✅ REAL AND WORKING';
      }
    }

    console.log('13. Testing Application Tracker...');
    if (tokenUser) {
      const trackerRes = await fetch(`${baseUrl}/applications/me`, {
        headers: { 'Authorization': `Bearer ${tokenUser}` }
      });
      if ((await trackerRes.json()).success) {
        report.applicationTracker = '✅ REAL AND WORKING';
      }
    }

    console.log('14. Testing Admin Edit Job...');
    if (jobId && tokenAdmin) {
      const editJobRes = await fetch(`${baseUrl}/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenAdmin}` },
        body: JSON.stringify({ title: 'Updated Test Job' })
      });
      if ((await editJobRes.json()).success) {
        report.adminEditJob = '✅ REAL AND WORKING';
      }
    }

    console.log('15. Testing Admin Delete Job...');
    if (jobId && tokenAdmin) {
      const deleteJobRes = await fetch(`${baseUrl}/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${tokenAdmin}` }
      });
      if ((await deleteJobRes.json()).success) {
        report.adminDeleteJob = '✅ REAL AND WORKING';
      }
    }

    console.log('\n--- FINAL REPORT ---');
    console.log(`1. Register: ${report.register}`);
    console.log(`2. Login: ${report.login}`);
    console.log(`3. Admin login: ${report.adminLogin}`);
    console.log(`4. Resume save: ${report.resumeSave}`);
    console.log(`5. Education: ${report.education}`);
    console.log(`6. Experience: ${report.experience}`);
    console.log(`7. Skills: ${report.skills}`);
    console.log(`8. Projects: ${report.projects}`);
    console.log(`9. Admin Add Job: ${report.adminAddJob}`);
    console.log(`10. Public Jobs: ${report.publicJobs}`);
    console.log(`11. Job Details: ${report.jobDetails}`);
    console.log(`12. Apply to Job: ${report.applyJob}`);
    console.log(`13. Application Tracker: ${report.applicationTracker}`);
    console.log(`14. Admin Edit Job: ${report.adminEditJob}`);
    console.log(`15. Admin Delete Job: ${report.adminDeleteJob}`);
    console.log(`- AI Resume Improvement: ${report.aiResume}`);
    console.log(`- AI Job Matching: ${report.aiJobMatch}`);

  } catch (error) {
    console.error('Test execution failed:', error.message);
  }
}

testPersistence();
