import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import NavBar from './components/layouts/NavBar';
import Users from './components/users/Users';
import User from './components/users/User';
import Search from './components/users/Search';
import Alert from './components/layouts/Alert';
import About from './components/pages/About';
import axios from 'axios';
import './App.css';

class App extends Component{
  state = {
    users: [],
    user: {},
    loading: false,
    alert: null,
    repos: []
  }

  async componentDidMount() {

    this.setState({ loading: true });

    const res = await axios.get(`https://api.github.com/users?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}`);
    
    this.setState({ users: res.data, loading: false });
  }

  // search github Users
  searchUsers = async text => {
    this.setState({loading: true})
    const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}`);
    
    this.setState({ users: res.data.items, loading: false });
 
  }
  // Get single github user
  getUser = async username => {
    this.setState({loading: true})
    const res = await axios.get(`https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}`);
    
    this.setState({ user: res.data, loading: false });
  }
  // Get Users repos
  getUserRepos = async username => {
    this.setState({loading: true})
    const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sortcreated:asc&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}`);
    
    this.setState({ repos: res.data, loading: false });
  }

  // clear users from state
  clearUsers = () => this.setState({ users: [], loading: false });
  
  // set alert
  setAlert = (message, type) => {
    this.setState({ alert: { message, type }})
    setTimeout(() => {
      this.setState({ alert: null })
    }, 3000);
  }
  
  render(){
    const { repos, user, users, loading } = this.state
    return (<Router>
    <div className='App'>      
    <NavBar />
    <div className="container">
      <Alert alert={this.state.alert} />
      <Switch>
        <Route exact path='/' render={props => (
          <Fragment>
            <Search 
              searchUsers={this.searchUsers}  
              clearUsers={this.clearUsers} 
              showClear={ this.state.users.length > 0 ? true: false } 
              setAlert={this.setAlert}
            />
      <Users loading={loading} users={users} />
          </Fragment>
        )} />
        <Route exact path='/about' component={About} />
        <Route exact path='/user/:login' render={props => (
          <User 
          {...props} 
          getUser={this.getUser} 
          getUserRepos={this.getUserRepos}
          user={user} 
          repos={repos}
          loading={loading}
          />
        )} />
      </Switch>      
    </div>

    </div>
    </Router>);
  }
}

export default App;
