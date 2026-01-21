import React, { useState, useEffect } from 'react';
import { employeeService, attendanceService } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalAttendanceRecords: 0,
    employeeStats: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const [employees, attendance] = await Promise.all([
        employeeService.getAll(),
        attendanceService.getAll(),
      ]);

      const employeeStatsMap = {};
      employees.forEach((emp) => {
        employeeStatsMap[emp.employee_id] = {
          employee_id: emp.employee_id,
          full_name: emp.full_name,
          department: emp.department,
          present: 0,
          absent: 0,
          total: 0,
        };
      });

      attendance.forEach((record) => {
        const empId = record.employee_id || record.employee?.employee_id;
        if (employeeStatsMap[empId]) {
          employeeStatsMap[empId].total++;
          if (record.status === 'Present') {
            employeeStatsMap[empId].present++;
          } else {
            employeeStatsMap[empId].absent++;
          }
        }
      });

      const employeeStats = Object.values(employeeStatsMap).sort((a, b) =>
        a.full_name.localeCompare(b.full_name)
      );

      setStats({
        totalEmployees: employees.length,
        totalAttendanceRecords: attendance.length,
        employeeStats,
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of employees and attendance statistics</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
            {stats.totalEmployees}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Total Employees
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
            {stats.totalAttendanceRecords}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Total Attendance Records
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Employee Attendance Summary</h2>
        </div>

        {stats.employeeStats.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <div className="empty-state-text">No data available</div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Full Name</th>
                  <th>Department</th>
                  <th>Present Days</th>
                  <th>Absent Days</th>
                  <th>Total Records</th>
                </tr>
              </thead>
              <tbody>
                {stats.employeeStats.map((empStat) => (
                  <tr key={empStat.employee_id}>
                    <td>{empStat.employee_id}</td>
                    <td>{empStat.full_name}</td>
                    <td>{empStat.department}</td>
                    <td>
                      <span className="badge badge-present">{empStat.present}</span>
                    </td>
                    <td>
                      <span className="badge badge-absent">{empStat.absent}</span>
                    </td>
                    <td>{empStat.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
