'use strict';

import './styles/main.scss';

import React from 'react';
import ReactDom from 'react-dom';
import superagent from 'superagent';

const API_URL = 'https://www.reddit.com/r';

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      val: '',
      limit: 1,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLimit = this.handleLimit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({val: e.target.value});
  }

  handleLimit(e) {
    this.setState({limit: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(this.props.get_set_app);
    this.props.update_state(this.state.val, this.state.limit);
  }

  render() {
    return (
      <form
        className="search-form"
        onSubmit={this.handleSubmit}>

        <input
          type="text"
          name="search"
          value={this.state.val}
          onChange={this.handleChange}
          placeholder="All"/>

        <input
          type="number"
          max="100"
          name="limit"
          value={this.state.limit}
          onChange={this.handleLimit}
          placeholder="1-100"/>
        <fieldset>
          <button type="submit">Search</button>
        </fieldset>
      </form>

    );
  }
}

class Results extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="results">
        {this.props.results ?
          <section className="results-data">
            <h2>{this.props.results.data.children[0].data.subreddit}</h2>
            <ul>
              {this.props.results.data.children.map((a, b) => {
                return <li key={b}>
                  <a href={a.data.url}><h3>{a.data.title}</h3><p>Ups: {a.data.ups}</p></a>
                </li>;
              })
              }
            </ul>
          </section>
          :
          undefined
        }

        {this.props.error ?

          <section className="results-error">
            <h2>errors.</h2>
          </section>
          :
          undefined
        }
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results:null,
      searchError: null,
    };
    this.searchApi = this.searchApi.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  updateState(name, limit) {
    this.searchApi(name, limit)
      .then(res => this.setState({results: res.body, searchError: null}))
      .catch(err => this.setState({results: null, searchError: err}));
  }

  searchApi(name, limit) {
    return superagent.get(`${API_URL}/${name}.json?limit=${limit}`);
  }

  render() {
    return (
      <div className="application">
        <SearchForm update_state={this.updateState} error={this.state.searchError}/>
        <Results results={this.state.results} error={this.state.searchError}/>
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById('root'));
