import axios from 'axios';
import '../App.css'
import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

class Read extends Component{
    constructor() {
      super();
      this.state = {
        data: [],
        isEditModalOpen: false,
        editedUserData: {
            id: '',
            firstName: '',
            lastName: '',
            email: '',
            contactNumber: '',
            errorEmail: '',
            errorNum: '',
        },
      };
    }

  componentDidMount(){
    var self = this;
    var contactsData;
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://contlist.000webhostapp.com/read.php", true);
    xhttp.send();
    xhttp.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        contactsData = JSON.parse(this.responseText);
        var arr = [];
        for(var x = 0; x < contactsData.count; x++){
          arr.push(contactsData.data[x]);
        }
        self.setState({
          data: arr
        })
      }
    };
  }

  handleDelete(id) {
    axios
        .post(`https://contlist.000webhostapp.com/delete.php?id=${id}`)
        .then((response) => {
            console.log('Data successfully posted:', response.data);
            window.location.reload();
        })
            .catch((error) => {
            console.error('Error posting data:', error);
        });
  }

  handleEdit = (id) => {
    const editedUser = this.state.data.find((item) => item.id === id);
    if (editedUser) {
      this.setState({
        isEditModalOpen: true,
        editedUserData: {
          id: editedUser.id,
          firstName: editedUser.firstName,
          lastName: editedUser.lastName,
          email: editedUser.email,
          contactNumber: editedUser.number,
        },
      });
    }
  };

  handleCloseEditModal = () => {
    this.setState({ isEditModalOpen: false });
  };

  handleUpdate = (e) => {
    e.preventDefault();
  
    const { id, firstName, lastName, email, contactNumber } = this.state.editedUserData;
  
    const validateEmail = (email) => {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      return emailRegex.test(email);
    };
  
    const validateContactNumber = (number) => {
      const numberRegex = /^[0-9]*$/;
      return numberRegex.test(number);
    };
  
    if (!validateEmail(email)) {
      this.setState({ errorEmail: 'Invalid email format!' });
      return;
    }
  
    if (!validateContactNumber(contactNumber)) {
      this.setState({ errorNum: 'Invalid contact number format!' });
      return;
    }
  
    axios
      .post(
        `https://contlist.000webhostapp.com/edit.php?id=${id}&fname=${firstName}&lname=${lastName}&emailAdd=${email}&contactNum=${contactNumber}&curEmail=${email}`
      )
      .then((response) => {
        console.log('Data successfully updated:', response.data);
        window.location.reload()
      })
      .catch((error) => {
        console.error('Error updating data:', error);
      });
  };

  handleEditInputChange = (e) => {
    this.setState({
      editedUserData: {
        ...this.state.editedUserData,
        [e.target.name]: e.target.value,
      },
    });
  };

  render() {
    const maxTextLength = 50;
    const maxNumLength = 15;

    return (
      <div>
        <div id="contactList">
          <center>
            <h1 className='text-white'>Contact List</h1>
          </center>
          <div className="table-responsive">
            <table className="table table-bordered table-rounded">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>LAST NAME</th>
                  <th>FIRST NAME</th>
                  <th>EMAIL ADDRESS</th>
                  <th>CONTACT NUMBER</th>
                  <th style={{ width: '100px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.lastName}</td>
                      <td>{item.firstName}</td>
                      <td>{item.email}</td>
                      <td>{item.number}</td>
                      <td className='d-flex flex-col gap-2'>
                        <button
                          className="btn btn-primary"
                          onClick={() => this.handleEdit(item.id)}
                        >
                          EDIT
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => this.handleDelete(item.id)}
                        >
                          DELETE
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <br />
          <Link
            className="btn btn-success"
            style={{ float: 'right', fontSize: '16px' }}
            to='/signup'
          >
            ADD CONTACT
          </Link>
        </div>
        <div className={`modal ${this.state.isEditModalOpen ? 'show' : ''}`} style={{ display: this.state.isEditModalOpen ? 'block' : 'none' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button type="button" className="close" onClick={this.handleCloseEditModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="editedFirstName">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      id="editedFirstName"
                      maxLength={maxTextLength}
                      value={this.state.editedUserData.firstName}
                      onChange={this.handleEditInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editedLastName">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      id="editedLastName"
                      maxLength={maxTextLength}
                      value={this.state.editedUserData.lastName}
                      onChange={this.handleEditInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editedEmail">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      id="editedEmail"
                      maxLength={maxTextLength}
                      value={this.state.editedUserData.email}
                      onChange={this.handleEditInputChange}
                    />
                    {this.state.errorEmail && <div className="text-danger">{this.state.errorEmail}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="editedContactNumber">Contact Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="contactNumber"
                      id="editedContactNumber"
                      pattern="[0-9]*"
                      maxLength={maxNumLength}
                      value={this.state.editedUserData.contactNumber}
                      onChange={this.handleEditInputChange}
                    />
                    {this.state.errorNum && <div className="text-danger">{this.state.errorNum}</div>}
                  </div>
                  <div className='d-flex justify-content-center gap-5 mt-2'>
                    <button type="button" className="btn btn-success" onClick={this.handleUpdate}>Update</button>
                    <button type="button" className="btn btn-secondary" onClick={this.handleCloseEditModal}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}  

export default Read