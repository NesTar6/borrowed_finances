import React, { Component } from "react";
import PlaidLink from "react-plaid-link";

import axios from "axios";
import firebase from "firebase";
import { getPlaid, getLoad } from "../../Store/plaidContainer";
import { connect } from "react-redux";
import { Loader } from "semantic-ui-react";
const path =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3001";
const firestore = firebase.firestore();
const settings = { /* your settings... */ timestampsInSnapshots: true };
firestore.settings(settings);

class BankLogInButton extends Component {
  state = {
    data: {},
    status: "LOGIN_BUTTON"
  };
  onClickHandler = () => {
    this.setState({ status: "LOADING" });
  };
  componentWillMount() {
    this.setState({ states: "LOGIN_BUTTON" });
  }

  onSuccess = async (token, metadata) => {
    this.props.getLoad();
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
    const plaidObj = { auth, transaction, balance, id, income };

    const user = firebase.auth().currentUser;
    const userEmail = user.email;

    const newPlaid = { ...plaidObj, email: userEmail };

    firestore
      .collection("user")
      .doc(user.uid)
      .update(newPlaid);
    const dataAPI = await firestore
      .collection("user")
      .doc(user.uid)
      .get()
      .then(user => user.data());
    this.props.getPlaid(dataAPI);
    // this.props.history.push('/')
  };

  render() {
    if (this.state.status) {
      return this.renderLogin();
    }
  }

  renderLogin() {
    return (
      <div className='center' >
      <PlaidLink
        className='center'
        clientName="Warblestein Finances"
        onMessage={this.onMessage}
        publicKey="0cf24d0681bbd05f7b23a59d2afb39"
        env="sandbox"
        product={["auth", "transactions"]}
        onLoad={this.onLoad}
        onLoadStart={this.onLoadStart}
        onLoadEnd={this.onLoadEnd}
        onSuccess={this.onSuccess}
        onClick={this.onClickHandler}
      >
        Open and connect to plaid
      </PlaidLink>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getPlaid: data => dispatch(getPlaid(data)),
    getLoad: () => dispatch(getLoad())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(BankLogInButton);
