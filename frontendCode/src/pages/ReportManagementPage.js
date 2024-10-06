import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Badge } from 'react-bootstrap';
import axios from 'axios';
import { localIP } from '../components/GetLocalIpAddress';

const ReportManagementPage = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Fetch reports
    const fetchReports = async () => {
        const token = localStorage.getItem('token');
      const { data } = await axios.get(`http://${localIP}:5000/api/admin/reports`,{headers: { Authorization: `Bearer ${token}` }});
      setReports(data);
    };
    fetchReports();
  }, []);

  const handleApprove = async (report) => {
    const token = localStorage.getItem('token');

    await axios.patch(`http://${localIP}:5000/api/admin/reports/${report._id}`, { status: 'approved' },{headers: { Authorization: `Bearer ${token}` }});
    setReports(reports.map(r => r._id === report._id ? { ...r, status: 'approved' } : r));
  };

  const handleReject = async (report) => {
    const token = localStorage.getItem('token');

    await axios.patch(`http://${localIP}:5000/api/admin/reports/${report._id}`, { status: 'rejected' },{headers: { Authorization: `Bearer ${token}` }});
    setReports(reports.map(r => r._id === report._id ? { ...r, status: 'rejected' } : r));
  };

  return (
    <Container>
      <h2>Report Management</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Reporter</th>
            <th>Content</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => (
            <tr key={report._id}>
              <td>{report.reporterName}</td>
              <td>{report.contentSnippet}</td>
              <td>{report.reason}</td>
              <td>
                <Badge bg={report.status === 'pending' ? 'warning' : report.status === 'approved' ? 'success' : 'danger'}>
                  {report.status}
                </Badge>
              </td>
              <td>
                {report.status === 'pending' && (
                  <>
                    <Button variant="success" onClick={() => handleApprove(report)}>Approve</Button>
                    <Button variant="danger" onClick={() => handleReject(report)} className="ms-2">Reject</Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ReportManagementPage;
