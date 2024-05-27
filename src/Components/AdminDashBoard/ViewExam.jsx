import React, { useEffect, useState } from 'react';
import "../../Style/AdminPagesStyle/StyleViewExam.css"
import axios from 'axios';
import copy from 'clipboard-copy';
import refreshicon from '../../ImagesAndLogo/refresh.png';
import gif from "../../ImagesAndLogo/loading-loading-forever.gif";
import BASE_URL from '../ApiConfig'
function ViewExam({adminEmail,adminId}) {
  const [examData, setExamData] = useState([]);
const [result,setResult]=useState(true);
  useEffect(() => {
    handleExamData();
  }, []);
  const token=localStorage.getItem('jwtToken');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
};

  const handleExamData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getAllExams/${adminEmail}`,config);
      setResult(false);
      setExamData(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteAll = async () => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete all Exam Data?');
      if (confirmDelete) {
        await axios.delete(`${BASE_URL}/deleteAllExams/${adminEmail}`,config);
        handleExamData();
      } else {
        console.log("Delete all discarded");
      }
    } catch (error) {
      console.error('Error deleting exams:', error);
    }
  };

  const handleDeleteById = async (examId) => {
    try {
      const confirmDelete = window.confirm(`Are you sure you want to delete the ${examId} Exam Record?`);
      if (confirmDelete) {
        await axios.delete(`${BASE_URL}/deleteExam/${examId}`,config);
        await axios.delete(`${BASE_URL}/deleteQuestionByExamId/${examId}`,config);
       
        handleExamData(); 
      } else {
        console.log("Delete discarded");
      }
    } catch (error) {
      console.error(`Error deleting exam with ID ${examId}:`, error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const formattedDate = new Date(timestamp).toLocaleString();
    return formattedDate;
  };

  const handleCopyUrl = (url) => {
    copy(url);
    alert('URL copied to clipboard!');
  };


  const inlineStyles = {
marginLeft:"10px"
  };
  return (
    <>
    <div className='xx'>
      <div className='viewExam-container'>
        <div className='AddStuTitle' style={inlineStyles}>Exams:</div>
        <br />
        <button type="button" class="btn btn-primary" style={{ margin: "10px" }} onClick={handleExamData}>
          Refresh {<img src={refreshicon} className='imgref' alt="refresh" />}
        </button>

        <br />
        <div style={inlineStyles}>   <b>  Total Number Of Exams: {examData.length}  </b>   </div>

        {result && (<div className='loading'>
          <div className='innerOfLoading'>
 Please wait, We are loading Exams...... {<img src={gif} className='gif' alt="refresh" />}
         </div>
         </div> )}
        {!result && examData.length<=0 &&(<div className='no-exam'>There is no Exam, please create one.</div> )}
        
        <div  className='tableDiv' >
          <table class="table table-striped custom-table table-examView">
            <thead>
              <tr>
                <th>Exam Name</th>
                <th>Exam Schedule</th>
                <th>Exam Duration</th>
                <th>Exam ID</th>
                <th>Exam Link</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {examData.map((exam) => (
                <tr key={exam.examId}>
                  <td>{exam.examName}</td>
                  <td>{formatTimestamp(exam.examSchedule)}</td>
                  <td>{exam.examDuration} minutes</td>
                  <td>{exam.examId}</td>
                  <td> http://localhost:3000/studentLogin/{exam.examId}/{adminId}
                  <button
                type="button"
                className="btn btn-primary btn-copy btn2 "
                onClick={() => handleCopyUrl(`http://localhost:3000/studentLogin/${exam.examId}/${adminId}`)}
              >copy</button> </td>
                  <td>
                    <button type="button" class="btn btn-danger" onClick={() => handleDeleteById(exam.examId)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>


        </div>

        <div><button type="button" class="btn btn-danger" onClick={handleDeleteAll}>Delete All</button></div>
      </div>
      </div>
    </>
  );
}

export default ViewExam;
