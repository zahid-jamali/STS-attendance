import './sub-components/manageUsers.report.css';
import { useEffect, useState, useRef } from 'react';
import AdminCreateAttendance from './AdminCreateAttendance';
import EditUserModal from './sub-components/editUserModal';
import UserWorksModal from './sub-components/UserWorksModal';
import AttendanceReportModal from './sub-components/AttendanceReportModal';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showWorksModel, setShowWorksModel] = useState(false);
  const [works, setWorks] = useState([]);
  const [record, setRecord] = useState([]);
  const [showAttendanceModel, setShowAttendanceModel] = useState(false);
  const [showTotalUsers, setShowTotalUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const roleRef = useRef();
  const bioRef = useRef();
  const activeRef = useRef();
  const adminRef = useRef();
  const newPasswordRef = useRef();

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const Users = users.filter(
      (U) =>
        U.Name.toLowerCase().includes(query.toLowerCase()) ||
        U.Email.toLowerCase().includes(query.toLowerCase())
    );

    if (query === '') {
      return setFilteredUsers(users);
    }
    setFilteredUsers(Users);
  };

  const updateUser = async (e) => {
    e.preventDefault();
    const updatedUser = {
      userId: selectedUser._id,
      name: nameRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      role: roleRef.current.value,
      bio: bioRef.current.value,
      newPassword: newPasswordRef.current.value,
      is_active: activeRef.current.checked,
      is_admin: adminRef.current.checked,
      admin: true,
    };
    let req = await fetch(`${process.env.REACT_APP_API_URLS}/updateUser`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser),
    });
    console.log(req);
    if (req.ok) {
      alert('Profile updated successfully!');
    } else {
      alert('Failed to update the profile.');
    }
  };

  let today = new Date();
  let monthBefore = new Date();
  monthBefore.setDate(today.getDate() - 30);

  const [startingDate, setStartingDate] = useState(
    monthBefore.toISOString().split('T')[0]
  );
  const [endingDate, setEndingDate] = useState(
    today.toISOString().split('T')[0]
  );

  const getAttendance = async (userId) => {
    if (!userId) return;

    try {
      let req = await fetch(
        `${process.env.REACT_APP_API_URLS}/getUserAttendance`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            startingDate,
            endingDate,
          }),
        }
      );

      if (req.ok) {
        let data = await req.json();
        setRecord(data);
      } else {
        console.error('Failed to fetch attendance');
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  useEffect(() => {
    if (showWorksModel) {
      const getMyWork = async () => {
        let req = await fetch(`${process.env.REACT_APP_API_URLS}/getMyWork`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({ userId: selectedUser._id }),
        });
        if (req.ok) {
          let data = await req.json();
          setWorks(data);
        }
      };
      getMyWork();
    }
  }, [showWorksModel, selectedUser._id]);

  const handleAttendanceClick = (user) => {
    setSelectedUser(user);
    setShowAttendanceModel(true);
    getAttendance(user._id);
  };

  const handleWorksClick = (user) => {
    setSelectedUser(user);
    setShowWorksModel(true);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleClose = () => {
    setShowEditModal(false);
    setShowAttendanceModel(false);
    setShowWorksModel(false);
  };

  const getAllUsers = async () => {
    let req = await fetch(`${process.env.REACT_APP_API_URLS}/get-total-users`);
    if (req.ok) {
      let data = await req.json();
      setUsers(data);
      setFilteredUsers(data);
    }
  };
  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <>
      <h2>Manage Users</h2>
      <AdminCreateAttendance />
      <div className="container mt-4">
        <div className="table-responsive">
          {/* Flex Container for Checkbox and Search Box */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            {/* Checkbox (Toggle Switch) on the Left */}
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="toggleSwitch"
                checked={showTotalUsers}
                onChange={(e) => setShowTotalUsers(e.target.checked)}
                style={{ width: '3rem', height: '1.5rem' }} // Larger toggle switch
              />
              <label className="form-check-label ms-2" htmlFor="toggleSwitch">
                <b>
                  Show Total Users <i>Inactive</i> Included
                </b>
              </label>
            </div>

            {/* Search Box on the Right */}
            <div style={{ width: '300px' }}>
              {' '}
              {/* Controlled width for search box */}
              <input
                type="text"
                className="form-control"
                placeholder="Search Here..."
                value={searchQuery}
                onChange={handleSearch}
                style={{
                  borderRadius: '25px', // Rounded corners
                  padding: '12px 20px', // Padding for height and width
                  fontSize: '16px', // Larger font size
                  border: '2px solid #ddd', // Light border
                  transition: 'border-color 0.3s ease', // Smooth transition
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#007bff'; // Highlight on focus
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ddd'; // Reset on blur
                }}
              />
            </div>
          </div>

          {/* Table */}
          <table className="table table-hover table-bordered text-center align-middle shadow-sm">
            <thead className="table-primary">
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            {/* Table Body */}
            {!showTotalUsers ? (
              <tbody>
                {filteredUsers.map((U) =>
                  U.is_Active ? (
                    <tr key={U.Email}>
                      <td className="fw-bold">
                        {U.Name}
                        {U.is_Admin ? (
                          <span
                            className="badge bg-primary ms-1"
                            style={{ borderRadius: '50%', fontSize: '0.7rem' }}
                            title="Verified Admin"
                          >
                            ✔
                          </span>
                        ) : (
                          ''
                        )}
                      </td>
                      <td>{U.Email}</td>
                      <td>
                        <div className="d-flex flex-wrap justify-content-center gap-2">
                          <button
                            className="btn btn-outline-primary btn-sm px-3"
                            onClick={() => handleEditClick(U)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn btn-outline-success btn-sm px-3"
                            onClick={() => handleWorksClick(U)}
                          >
                            📊 Track Progress
                          </button>
                        </div>
                        <hr />
                        <div className="d-flex flex-column align-items-center gap-2">
                          <div className="d-flex gap-2">
                            <div>
                              <label className="form-label fw-bold">From</label>
                              <input
                                type="date"
                                className="form-control form-control-sm"
                                key={startingDate}
                                defaultValue={startingDate}
                                onChange={(e) =>
                                  setStartingDate(e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <label className="form-label fw-bold">To</label>
                              <input
                                type="date"
                                className="form-control form-control-sm"
                                onChange={(e) => setEndingDate(e.target.value)}
                              />
                            </div>
                          </div>
                          <button
                            className="btn btn-warning btn-sm px-3 mt-2"
                            onClick={() => handleAttendanceClick(U)}
                          >
                            📅 Attendance Report
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <></>
                  )
                )}
              </tbody>
            ) : (
              <tbody>
                {filteredUsers.map((U) => (
                  <tr key={U.Email}>
                    <td className="fw-bold">{U.Name}</td>
                    <td>{U.Email}</td>
                    <td>
                      <div className="d-flex flex-wrap justify-content-center gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm px-3"
                          onClick={() => handleEditClick(U)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-outline-success btn-sm px-3"
                          onClick={() => handleWorksClick(U)}
                        >
                          📊 Track Progress
                        </button>
                      </div>
                      <hr />
                      <div className="d-flex flex-column align-items-center gap-2">
                        <div className="d-flex gap-2">
                          <div>
                            <label className="form-label fw-bold">From</label>
                            <input
                              type="date"
                              className="form-control form-control-sm"
                              onChange={(e) => setStartingDate(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="form-label fw-bold">To</label>
                            <input
                              type="date"
                              className="form-control form-control-sm"
                              onChange={(e) => setEndingDate(e.target.value)}
                            />
                          </div>
                        </div>
                        <button
                          className="btn btn-warning btn-sm px-3 mt-2"
                          onClick={() => handleAttendanceClick(U)}
                        >
                          📅 Attendance
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
      {/* Edit User modal JSX Here  */}
      <EditUserModal
        show={showEditModal}
        handleClose={handleClose}
        selectedUser={selectedUser}
        updateUser={updateUser}
        nameRef={nameRef}
        emailRef={emailRef}
        phoneRef={phoneRef}
        roleRef={roleRef}
        bioRef={bioRef}
        activeRef={activeRef}
        adminRef={adminRef}
        newPasswordRef={newPasswordRef}
      />
      {/* User Commits Modal Here  */}
      <UserWorksModal
        show={showWorksModel}
        handleClose={handleClose}
        works={works}
      />
      {/* Attendance Report Modal Here  */}
      <AttendanceReportModal
        show={showAttendanceModel}
        handleClose={handleClose}
        selectedUser={selectedUser}
        record={record}
        startingDate={startingDate}
        endingDate={endingDate}
      />
      ;
    </>
  );
};

export default ManageUsers;
