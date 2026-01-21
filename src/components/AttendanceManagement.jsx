import React, { useState, useEffect } from 'react';
import { attendanceService, employeeService } from '../services/api';

const AttendanceManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [useDateRange, setUseDateRange] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
  });
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [employeesData, attendanceData] = await Promise.all([
        employeeService.getAll(),
        attendanceService.getAll(),
      ]);
      setEmployees(employeesData);
      setAttendance(attendanceData);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      if (editingAttendance) {
        await attendanceService.update(editingAttendance.id, formData);
      } else {
        await attendanceService.create(formData);
      }
      setShowModal(false);
      setEditingAttendance(null);
      setFormData({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
      });
      fetchData();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 
                          (Array.isArray(err.response?.data?.detail) 
                            ? err.response.data.detail.map(d => d.msg || d).join(', ')
                            : `Failed to ${editingAttendance ? 'update' : 'mark'} attendance`);
      setFormError(errorMessage);
      console.error('Attendance update error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (record) => {
    setEditingAttendance(record);
    setFormData({
      employee_id: record.employee_id || record.employee?.employee_id || '',
      date: record.date,
      status: record.status,
    });
    setShowModal(true);
    setFormError(null);
  };

  const handleDelete = async (attendanceId) => {
    try {
      await attendanceService.delete(attendanceId);
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete attendance record');
    }
  };

  const openModal = () => {
    if (employees.length === 0) {
      alert('Please add employees first before marking attendance');
      return;
    }
    setEditingAttendance(null);
    setShowModal(true);
    setFormError(null);
    setFormData({
      employee_id: employees[0]?.employee_id || '',
      date: new Date().toISOString().split('T')[0],
      status: 'Present',
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAttendance(null);
    setFormError(null);
    setFormData({
      employee_id: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Present',
    });
  };

  const filterAttendanceByDate = (records) => {
    if (!useDateRange && !filterDate) return records;
    
    if (useDateRange) {
      if (!filterStartDate && !filterEndDate) return records;
      return records.filter((record) => {
        const recordDate = new Date(record.date);
        const startDate = filterStartDate ? new Date(filterStartDate) : null;
        const endDate = filterEndDate ? new Date(filterEndDate) : null;
        
        if (startDate && endDate) {
          return recordDate >= startDate && recordDate <= endDate;
        } else if (startDate) {
          return recordDate >= startDate;
        } else if (endDate) {
          return recordDate <= endDate;
        }
        return true;
      });
    } else {
      if (!filterDate) return records;
      const selectedDate = new Date(filterDate);
      return records.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate.toDateString() === selectedDate.toDateString();
      });
    }
  };

  let filteredAttendance = selectedEmployee === 'all'
    ? attendance
    : attendance.filter(record => record.employee_id === selectedEmployee || record.employee?.employee_id === selectedEmployee);
  
  filteredAttendance = filterAttendanceByDate(filteredAttendance);

  const clearDateFilter = () => {
    setFilterDate('');
    setFilterStartDate('');
    setFilterEndDate('');
    setUseDateRange(false);
  };

  const hasActiveDateFilter = filterDate || filterStartDate || filterEndDate;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
        <h1 className="page-title">Attendance Management</h1>
        <p className="page-subtitle">Track and manage employee attendance records</p>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Attendance Records</h2>
          <button className="btn btn-primary" onClick={openModal}>
            + Mark Attendance
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }} className="filter-container">
          {employees.length > 0 && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Filter by Employee</label>
              <select
                className="form-select"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="all">All Employees</option>
                {employees.map((employee) => (
                  <option key={employee.employee_id} value={employee.employee_id}>
                    {employee.full_name} ({employee.employee_id})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              <input
                type="checkbox"
                checked={useDateRange}
                onChange={(e) => {
                  setUseDateRange(e.target.checked);
                  if (!e.target.checked) {
                    setFilterStartDate('');
                    setFilterEndDate('');
                  } else {
                    setFilterDate('');
                  }
                }}
                style={{ marginRight: '0.5rem' }}
              />
              Use Date Range
            </label>
            {!useDateRange ? (
              <div style={{ display: 'flex', gap: '0.5rem' }} className="date-filter-row">
                <input
                  type="date"
                  className="form-input"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  placeholder="Filter by date"
                  style={{ flex: 1 }}
                />
                {filterDate && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={clearDateFilter}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Clear
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }} className="date-range-row">
                <div style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>From Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>To Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                  />
                </div>
                {hasActiveDateFilter && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={clearDateFilter}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {hasActiveDateFilter && (
          <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--background)', borderRadius: '0.375rem', fontSize: '0.875rem' }}>
            <strong>Date Filter:</strong>{' '}
            {useDateRange
              ? `${filterStartDate || 'Any'} to ${filterEndDate || 'Any'}`
              : filterDate}
            {' '}({filteredAttendance.length} record{filteredAttendance.length !== 1 ? 's' : ''} found)
          </div>
        )}

        {filteredAttendance.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <div className="empty-state-text">No attendance records found</div>
            <p>
              {hasActiveDateFilter || selectedEmployee !== 'all'
                ? 'No records match your filter criteria. Try adjusting your filters.'
                : 'Get started by marking attendance for employees'}
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((record) => (
                <tr key={record.id}>
                  <td>{formatDate(record.date)}</td>
                  <td>{record.employee_id || record.employee?.employee_id}</td>
                  <td>{record.employee?.full_name || 'N/A'}</td>
                  <td>{record.employee?.department || 'N/A'}</td>
                  <td>
                    <span
                      className={`badge ${
                        record.status === 'Present'
                          ? 'badge-present'
                          : 'badge-absent'
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }} className="action-buttons">
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleEdit(record)}
                        style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => setDeleteConfirm(record)}
                        style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingAttendance ? 'Edit Attendance' : 'Mark Attendance'}</h2>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {formError && (
                <div className="alert alert-error">{formError}</div>
              )}

              <div className="form-group">
                <label className="form-label">Employee *</label>
                <select
                  className="form-select"
                  value={formData.employee_id}
                  onChange={(e) =>
                    setFormData({ ...formData, employee_id: e.target.value })
                  }
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee.employee_id} value={employee.employee_id}>
                      {employee.full_name} ({employee.employee_id}) - {employee.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status *</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  required
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? (editingAttendance ? 'Updating...' : 'Saving...') : (editingAttendance ? 'Update Attendance' : 'Mark Attendance')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Confirm Delete</h2>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}>
                ×
              </button>
            </div>

            <p>
              Are you sure you want to delete the attendance record for{' '}
              <strong>{deleteConfirm.employee?.full_name || deleteConfirm.employee_id}</strong> on{' '}
              <strong>{formatDate(deleteConfirm.date)}</strong> ({deleteConfirm.status})?
            </p>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(deleteConfirm.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;
