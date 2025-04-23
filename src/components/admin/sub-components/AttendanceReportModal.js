import React from 'react';
import { Modal, Badge, Button } from 'react-bootstrap';
import logo from '../images/logo.png';

const AttendanceReportModal = ({
  show,
  handleClose,
  selectedUser,
  record,
  startingDate,
  endingDate,
}) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      className="attendance-report-modal"
      size="lg"
      centered
    >
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <div className="d-flex align-items-center">
            <img
              src={logo}
              alt="Sindh Tech Solution"
              style={{ height: '40px', marginRight: '15px' }}
            />
            <div>
              <h4 className="mb-0">Employee Attendance Report</h4>
              <small className="fw-light">Sindh Tech Solution</small>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Report Header */}
        <div className="report-header mb-4 p-3 border-bottom">
          <div className="row">
            <div className="col-md-6">
              <p className="mb-1">
                <strong>Employee:</strong> {selectedUser?.Name || 'N/A'}
              </p>
              <p className="mb-1">
                <strong>Email:</strong> {selectedUser?.Email || 'N/A'}
              </p>
            </div>
            <div className="col-md-6 text-end">
              <p className="mb-1">
                <strong>Period:</strong>{' '}
                {new Date(startingDate).toLocaleDateString()} to{' '}
                {new Date(endingDate).toLocaleDateString()}
              </p>
              <p className="mb-1">
                <strong>Generated:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards mb-4">
          <div className="row g-3">
            {[
              {
                title: 'Total Present',
                value: record.filter((entry) =>
                  entry.records.some(
                    (rec) =>
                      rec.user._id === selectedUser._id &&
                      !['Absent', 'Sunday', 'On Leave', 'Holiday'].includes(
                        rec.Remarks
                      )
                  )
                ).length,
                border: 'primary',
                text: 'primary',
              },
              {
                title: 'Total Hours',
                value:
                  record.reduce((total, entry) => {
                    const rec = entry.records.find(
                      (r) => r.user._id === selectedUser._id
                    );
                    return total + (rec?.workHours || 0);
                  }, 0) + ' hrs',
                border: 'success',
                text: 'success',
              },
              {
                title: 'Leaves',
                value: record.filter((entry) =>
                  entry.records.some(
                    (rec) =>
                      rec.user._id === selectedUser._id &&
                      rec.Remarks === 'On Leave'
                  )
                ).length,
                border: 'warning',
                text: 'warning',
              },
              {
                title: 'Absents',
                value: record.filter((entry) =>
                  entry.records.some(
                    (rec) =>
                      rec.user._id === selectedUser._id &&
                      rec.Remarks === 'Absent'
                  )
                ).length,
                border: 'danger',
                text: 'danger',
              },
            ].map((item, i) => (
              <div className="col-md-3" key={i}>
                <div className={`card h-100 border-${item.border}`}>
                  <div className="card-body text-center">
                    <h6 className="card-title">{item.title}</h6>
                    <h3 className={`text-${item.text}`}>{item.value}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="detailed-breakdown mb-4">
          <h5 className="mb-3 border-bottom pb-2">Daily Attendance Records</h5>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Status</th>
                  <th>Entry</th>
                  <th>Exit</th>
                  <th>Hours</th>
                </tr>
              </thead>
              <tbody>
                {record.length > 0 ? (
                  [...record].reverse().map((entry, index) => {
                    const rec = entry.records.find(
                      (r) => r.user._id === selectedUser._id
                    );
                    if (!rec) return null;

                    const dayName = new Intl.DateTimeFormat('en-US', {
                      weekday: 'short',
                      timeZone: 'Asia/Karachi',
                    }).format(new Date(entry.date));

                    const isWeekend = dayName === 'Sun';

                    return (
                      <tr
                        key={index}
                        className={isWeekend ? 'table-secondary' : ''}
                      >
                        <td>{entry.date}</td>
                        <td>{dayName}</td>
                        <td>
                          <Badge
                            bg={
                              rec.Remarks === 'On Leave'
                                ? 'warning'
                                : rec.Remarks === 'Holiday'
                                  ? 'info'
                                  : isWeekend
                                    ? 'secondary'
                                    : rec.Remarks === 'Absent'
                                      ? 'danger'
                                      : 'success'
                            }
                            className="text-capitalize"
                          >
                            {rec.Remarks || 'Present'}
                          </Badge>
                        </td>
                        <td>
                          {rec.entryTime
                            ? new Date(rec.entryTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'N/A'}
                        </td>
                        <td>
                          {rec.exitTime
                            ? new Date(rec.exitTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'N/A'}
                        </td>
                        <td>{rec.workHours || (rec.Remarks ? '—' : '0')}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No attendance records found for this period
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="statistics-summary p-3 bg-light rounded">
          <h5 className="mb-3">Period Summary</h5>
          {(() => {
            const sundays = record.filter(
              (entry) => new Date(entry.date).getDay() === 6
            );
            const holidays = record.filter((entry) =>
              entry.records.some(
                (rec) =>
                  rec.user._id === selectedUser._id && rec.Remarks === 'Holiday'
              )
            );

            const workingDays = record.filter((entry) => {
              const date = new Date(entry.date);
              const rec = entry.records.find(
                (r) => r.user._id === selectedUser._id
              );
              return date.getDay() !== 6 && rec?.Remarks !== 'Holiday';
            });

            const presentDays = workingDays.filter((entry) => {
              const rec = entry.records.find(
                (r) => r.user._id === selectedUser._id
              );
              return rec?.entryTime && !rec?.Remarks;
            });

            const attendancePercentage =
              workingDays.length > 0
                ? `${Math.round((presentDays.length / workingDays.length) * 100)}%`
                : 'N/A';

            return (
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>Working Days:</strong> {workingDays.length}
                  </p>
                  <p>
                    <strong>Holidays:</strong> {holidays.length}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Sundays:</strong> {sundays.length}
                  </p>
                  <p>
                    <strong>Attendance Percentage:</strong>{' '}
                    {attendancePercentage}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button
          variant="outline-primary"
          onClick={() => {
            const originalTitle = document.title;
            document.title = `Attendance Report - ${selectedUser?.Name || 'Employee'} - ${new Date().toLocaleDateString()}`;
            window.print();
            document.title = originalTitle;
          }}
        >
          🖨️ Print Report
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AttendanceReportModal;
