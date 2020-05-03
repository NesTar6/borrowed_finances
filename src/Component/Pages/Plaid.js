import React, { Component } from "react";
import PlaidLink from "react-plaid-link";
import axios from "axios";
import firebase from 'firebase'
import {getPlaid} from '../../Store/plaidContainer'
import{connect} from 'react-redux'
import { Loader } from 'semantic-ui-react'

// Port must match in .env
const path = process.env.NODE_ENV==="production"?"": "http://localhost:3001";

const firestore = firebase.firestore();
const settings = {};
firestore.settings(settings);


class Plaid extends Component {
  state = {
    data: {},
    status: "LOGIN_BUTTON"
  };

  render() {
    // console.log(this.state.status);
  
    switch (this.state.status) {
      case "CONNECTED":
        console.log("connected");
        return this.renderDetails();
      case "LOADING":
        return this.loading()
      default:
        return this.renderLogin();
    }
  }

  loading=()=>{
    return(
            <Loader active>Preparing Files</Loader>
    )
  }

  renderButton = () => {
    return (
      <div>
        <button onClick={() => this.setState({ status: "" })} >Link Account</button>
        <p>Login with Plaid</p>
      </div>
    );
  };

  onLoadStart = props => {
    console.log("onLoadStart", props);
  };

  onLoad = props => {
    console.log("onLoad", props);
  };

  onLoadEnd = props => {
    console.log("onLoadEnd", props);
  };
  onSuccess = async (token, metadata) => {
    console.log('SUCCESS')
    await axios.post(`${path}/get_access_token`, {
      public_token: metadata.public_token,
      accounts: metadata.accounts,
      institution: metadata.institution,
      link_session_id: metadata.link_session_id
    });
    const authData = await axios.post(`${path}/auth/get`);
    const auth = authData.data;
    const transactionData = await axios.post(`${path}/transaction/get`);
    const transaction = transactionData.data;
    const balanceData = await axios.post(`${path}/accounts/balance/get`);
    const balance = balanceData.data;
    const idData = await axios.post(`${path}/identity/get`);
    const id = idData.data;
    const incomeData = await axios.post(`${path}/income/get`);
    const income = incomeData.data;
    const plaidObj = {auth, transaction, balance, id, income}


    const user = firebase.auth().currentUser;
    const userEmail = user.email;
    
    const newPlaid = {...plaidObj, email: userEmail}

    firestore.collection('user').doc(user.uid).update(newPlaid).then(() => {
      console.log("Connected to Plaid")
    }).catch(() => {
      console.log("error")
    })
    const dataAPI = await firestore.collection('user').doc(user.uid).get().then(user=>user.data())
    console.log("Now persistent")
    
    this.props.getPlaid(dataAPI);
    this.props.history.push('/')
  };
  onMessage = data => {
    console.log(data);
    this.setState({
      data,
      status: data.action.substr(data.action.lastIndexOf(":") + 1).toUpperCase()
    });
  };

  renderLogin() {
    console.log("Plaid.renderLogin", this);
    return (
      <PlaidLink
        clientName="Warblestein Finance"
        onMessage={this.onMessage}
        publicKey="0cf24d0681bbd05f7b23a59d2afb39"
        env="development"
        product={["auth", "transactions"]}
        onLoad={this.onLoad}
        onLoadStart={this.onLoadStart}
        onLoadEnd={this.onLoadEnd}
        onSuccess={this.onSuccess}
        onClick={() => this.setState({type : "LOADING"})}
      >
        Open and connect to plaid
      </PlaidLink>
    );
  }

  // renderDetails() {
  //   return (
  //     <div>
  //       <div>Institution</div>
  //       <div>{this.state.data.metadata.institution.name}</div>
  //       <div>Institution ID</div>
  //       <div>{this.state.data.metadata.institution.institution_id}</div>
  //       <div>Token</div>
  //       <div>{this.state.data.metadata.public_token}</div>
  //     </div>
  //   );
  // }

  
}

const mapDispatch = (dispatch)=>{
  return{
    getPlaid: (data)=>dispatch(getPlaid(data))
  }
}

export default connect(null, mapDispatch)(Plaid)