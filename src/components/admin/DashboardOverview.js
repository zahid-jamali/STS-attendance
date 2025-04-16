import { useEffect, useState, useCallback } from 'react';

const DashboardOverview = () => {
  const [records, setRecords] = useState([]);
  const [inputDate, setInputDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [startingDate, setStartingDate] = useState();
  const [endingDate, setEndingDate] = useState();
  const [flag, setFlag] = useState(false);
  const [data, setData] = useState([]);

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return `${month}-${day}-${year}`;
  };

  const handleRequest = useCallback(async (date) => {
    const formattedDate = formatDate(date);

    try {
      let req = await fetch(
        `${process.env.REACT_APP_API_URLS}/getUsersAttendanceByDate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ date: formattedDate }),
        }
      );

      if (req.ok) {
        const data = await req.json();
        setRecords(data);
      } else {
        console.error('Failed to fetch attendance by date');
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  }, []);

  const handleStaringAndEndDate = async () => {
    setFlag(true);
    let req = await fetch(
      `${process.env.REACT_APP_API_URLS}/getUserAttendance`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          startingDate: startingDate,
          endingDate: endingDate,
        }),
      }
    );
    if (req.ok) {
      let tmp = await req.json();
      setData(tmp);
    } else {
      alert(
        'Error occured, please refresh, if the issue persist, contact to developer!'
      );
    }
  };

  useEffect(() => {
    handleRequest(inputDate);
  }, [inputDate, handleRequest]);

  return (
    <>
      <h2 align="center">Dashboard</h2>
      <div className="card p-4 shadow">
        <h3 className="text-secondary">Attendance</h3>
        <p className="mb-2">Check attendance for a single date:</p>
        <input
          className="form-control mb-3"
          type="date"
          onChange={(e) => {
            setInputDate(e.target.value);
            handleRequest(e.target.value);
          }}
        />
        <p>
          <strong>Selected Date:</strong> {inputDate}
        </p>

        <p className="mt-4">Check attendance for a date range:</p>
        <label className="form-label">Starting Date:</label>
        <input
          className="form-control mb-2"
          type="date"
          onChange={(e) => setStartingDate(formatDate(e.target.value))}
        />
        <label className="form-label">Ending Date:</label>
        <input
          className="form-control mb-3"
          type="date"
          onChange={(e) => setEndingDate(formatDate(e.target.value))}
        />
        <button
          className="btn btn-primary w-100"
          onClick={handleStaringAndEndDate}
        >
          Check
        </button>
      </div>
      {/* <button className="btn btn-primary m-5" onClick={() => handleRequest(inputDate)}>Check</button> */}
      {flag ? (
        [...data.reverse()].map((R) => (
          <>
            <h5 className="text-dark">Date: {R.date}</h5>
            <DisplayRecord info={R.records} />
          </>
        ))
      ) : (
        <>
          <DisplayRecord info={records} />
        </>
      )}
    </>
  );
};

export default DashboardOverview;

const DisplayRecord = (props) => {
  return (
    <table border="1" width="100%" cellPadding="10">
      <thead>
        <tr>
          <th>Name</th>
          <th>Entry Time</th>
          <th>Exit Time</th>
          <th>Work Hours</th>
          <th>Remarks</th>
        </tr>
      </thead>
      <tbody>
        {props.info.map((rec) => {
          const attendance = rec.attendanceRecords; // Can be an object or null

          return (
            <tr key={rec._id}>
              <td>{rec.Name || rec.user?.Name || 'Unknown'}</td>
              <td>
                {attendance && attendance.entryTime
                  ? new Date(attendance.entryTime).toLocaleTimeString()
                  : rec.entryTime
                    ? new Date(rec.entryTime).toLocaleTimeString()
                    : 'N/A'}
              </td>
              <td>
                {attendance && attendance.exitTime
                  ? new Date(attendance.exitTime).toLocaleTimeString()
                  : rec.exitTime
                    ? new Date(rec.exitTime).toLocaleTimeString()
                    : 'N/A'}
              </td>
              <td>
                {attendance && attendance.workHours
                  ? attendance.workHours
                  : rec.workHours
                    ? rec.workHours
                    : 'N/A'}
              </td>
              <td>
                {attendance && attendance.Remarks
                  ? attendance.Remarks
                  : rec.Remarks
                    ? rec.Remarks
                    : ''}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
