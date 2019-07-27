import React from "react";
import firebase from "firebase/app";
import $ from "jquery";
import "firebase/firestore";

const db = firebase.firestore();

let allSymbols;

export default class Topbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fundsLoader: "",
      funds: ""
    };
  }
  searchStocks(e) {
    document.getElementById("results").innerHTML = "";
    let b = 0;
    let filter = document.getElementById("searchBar").value.toUpperCase();
    if (e.key === "Enter") window.location = "stocks/" + filter;
    if (filter.length === 0) {
      document.getElementById("results").innerHTML = "";
      document.getElementById("results").style.display = "none";
    } else {
      for (let i = 0; i < allSymbols.length; i++) {
        let splitSymbol = allSymbols[i].symbol.split("");
        let splitFilter = filter.split("");
        for (let a = 0; a < splitFilter.length; a++) {
          if (
            allSymbols[i].symbol.indexOf(filter) > -1 &&
            splitSymbol[a] === splitFilter[a]
          ) {
            if (a === 0) {
              document.getElementById("results").style.display = "flex";
              $("#results").append(
                `<li><a href="/stocks/${allSymbols[i].symbol}"><h4>${
                  allSymbols[i].symbol
                }</h4><h6>${allSymbols[i].name}</h6></a></li>`
              );
              b++;
            }
          }
        }
        if (b === 10) break;
      }
    }
  }
  numberWithCommas(x) {
    return x.toLocaleString();
  }

  componentDidMount() {
    let user = firebase.auth().currentUser.uid;
    fetch(
      "https://cloud.iexapis.com/stable/ref-data/symbols?token=pk_d0e99ea2ee134a4f99d0a3ceb700336c"
    )
      .then((res) => res.json())
      .then((result) => {
        allSymbols = result.map((val) => {
          return val;
        });
      });
    db.collection("users")
      .doc(user)
      .onSnapshot(
        function(doc) {
          if (doc.data() !== undefined)
            this.setState({
              funds:
                "$" + this.numberWithCommas(Number(doc.data()["currentfunds"])),
              fundsLoader: true
            });
        }.bind(this)
      );
  }

  render() {
    let user = firebase.auth().currentUser.displayName;
    return (
      <div className="topbar">
        <div className="hamburger">
          <div className="hamburger__container">
            <div className="hamburger__inner" />
            <div className="hamburger__hidden" />
          </div>
        </div>
        <div className="topbar__searchbar" id="topbar__searchbar">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%"
            }}
          >
            <svg
              enableBackground="new 0 0 250.313 250.313"
              version="1.1"
              viewBox="0 0 250.313 250.313"
              xmlSpace="preserve"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m244.19 214.6l-54.379-54.378c-0.289-0.289-0.628-0.491-0.93-0.76 10.7-16.231 16.945-35.66 16.945-56.554 0-56.837-46.075-102.91-102.91-102.91s-102.91 46.075-102.91 102.91c0 56.835 46.074 102.91 102.91 102.91 20.895 0 40.323-6.245 56.554-16.945 0.269 0.301 0.47 0.64 0.759 0.929l54.38 54.38c8.169 8.168 21.413 8.168 29.583 0 8.168-8.169 8.168-21.413 0-29.582zm-141.28-44.458c-37.134 0-67.236-30.102-67.236-67.235 0-37.134 30.103-67.236 67.236-67.236 37.132 0 67.235 30.103 67.235 67.236s-30.103 67.235-67.235 67.235z"
                clipRule="evenodd"
                fillRule="evenodd"
              />
            </svg>
            <input
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              type="text"
              id="searchBar"
              onKeyUp={this.searchStocks}
              placeholder="Search by symbol"
              onFocus={() => {
                if (document.getElementById("results").firstChild)
                  document.getElementById("results").style.display = "flex";
                document.getElementById("topbar__searchbar").style.boxShadow =
                  "0px 0px 30px 0px rgba(0,0,0,0.10)";
                document.getElementById("results").style.boxShadow =
                  "0px 30px 20px 0px rgba(0,0,0,0.10)";
              }}
              onBlur={() => {
                setTimeout(() => {
                  if ($("#results").length)
                    document.getElementById("results").style.display = "none";
                }, 300);
                document.getElementById("topbar__searchbar").style.boxShadow =
                  "none";
              }}
              autoComplete="off"
            />
          </div>
          <ul className="topbar__results" id="results" />
        </div>
        <div className="topbar__container">
          <div className="topbar__user">
            {this.state.fundsLoader === true && (
              <div className="topbar__power">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g>
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M18 7h3a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h15v4zM4 9v10h16V9H4zm0-4v2h12V5H4zm11 8h3v2h-3v-2z" />
                  </g>
                </svg>
                <h3>{this.state.funds}</h3>
              </div>
            )}
            <span className="leftbar__name"> &nbsp;{user}</span>
          </div>
        </div>
      </div>
    );
  }
}