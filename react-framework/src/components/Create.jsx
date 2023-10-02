import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      contactNumber: '',
      errorEmail: '',
      errorNumber: '',
      errorMessage: '',
      message: ''
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleRegister = (e) => {
    e.preventDefault();

    const formData = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      contactNumber: this.state.contactNumber,
    };

    const validateEmail = (email) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    };

    const validateContactNumber = (number) => {
        const numberRegex = /^[0-9]*/;
        return numberRegex.test(number);
    };

    if(formData.email === '' || formData.contactNumber === '' || formData.firstName === '' || formData.lastName === '') {
        return this.setState({ errorMessage: 'Please Input all values' });
    }

    if(!validateEmail(formData.email)) {
        return this.setState({ errorEmail: 'Invalid email format!' });
    }

    if(!validateContactNumber(formData.contactNumber)) {
        return this.setState({ errorNumber: 'Invalid contact number!' });
    }

    axios
    .post(`https://contlist.000webhostapp.com/add.php?fname=${formData.firstName}&lname=${formData.lastName}&emailAdd=${formData.email}&contactNum=${formData.contactNumber}`)
    .then((response) => {
      if (response.data.data === -1) {
        this.setState({ errorMessage: response.data.message });
      } else {
        console.log('Data successfully posted:', response.data);
        this.setState({ message: 'User added successfully! Redirecting in 3 seconds...' });
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }
    })
    .catch((error) => {
      console.error('Error posting data:', error);
    });
  };



  render() {
    const maxTextLength = 50;
    const maxNumLength = 15;

    return (
      <div className='d-flex flex-column gap-4'>
        <h1>Add a new contact</h1>
        <form className='d-flex flex-column gap-3'>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              className="form-control"
              name="firstName"
              id="firstName"
              value={this.state.firstName}
              onChange={this.handleChange}
              maxLength={maxTextLength}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              className="form-control"
              name="lastName"
              id="lastName"
              value={this.state.lastName}
              onChange={this.handleChange}
              maxLength={maxTextLength}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              id="email"
              value={this.state.email}
              onChange={this.handleChange}
              maxLength={maxTextLength}
              required
            />
            {this.state.errorEmail && <div>{this.state.errorEmail}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number</label>
            <input
              type="tel"
              className="form-control"
              name="contactNumber"
              id="contactNumber"
              pattern="[0-9]*"
              value={this.state.contactNumber}
              onChange={this.handleChange}
              maxLength={maxNumLength}
              required
            />
            {this.state.errorNumber && <div>{this.state.errorNumber}</div>}
          </div>
          {this.state.message && <div>{this.state.message}</div>}
          {this.state.errorMessage && <div>{this.state.errorMessage}</div>}
          <button className="btn btn-primary mt-3 mx-auto w-50" onClick={this.handleRegister}>Submit</button>
        </form>
        <div>
          <span>Don't wanna add? </span>
          <Link to='/'>Back to Home</Link>
        </div>
      </div>
    );
  }
}

export default Create;
