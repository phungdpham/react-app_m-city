import React, { Component } from "react";
import AdminLayout from "../../../Hoc/AdminLayout";

import FormField from "../../ui/formFields";
import { validate } from "../../ui/misc";

import Fileuploader from '../../ui/fileuploader';
import { firebasePlayers, firebaseDB, firebaseMatches } from '../../../firebase';

class AddEditPlayers extends Component {
  state = {
    playerId: "",
    formType: "",
    formError: false,
    formSuccess: "",
    teams: [],
    formdata: {
      name: {
        element: "input",
        value: "",
        config: {
          label: "Player Name",
          name: "name_input",
          type: "text"
        },
        validation: {
          required: true,
        },
        valid: false,
        validationMessage: "",
        showlabel: true
      },
      lastname: {
        element: "input",
        value: "",
        config: {
          label: "Player Last name",
          name: "lastname_input",
          type: "text",
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: "",
        showlabel: true
      },
      resultLocal: {
        element: "input",
        value: "",
        config: {
          label: "Result local",
          name: "result_local_input",
          type: "text"
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: "",
        showlabel: true
      },
      number: {
        element: "input",
        value: "",
        config: {
          label: "Player number",
          name: "number_input",
          type: "text",
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: "",
        showlabel: true
      },
      position: {
        element: "select",
        value: "",
        config: {
          label: "Select a position",
          name: "select_position",
          type: "text",
          options: [
            {key: 'Keeper', value: 'Keeper'},
            {key: 'Defence', value: 'Defence'},
            {key: 'Midfield', value: 'Midfield'},
            {key: 'Striker', value: 'Striker'},
          ]
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: "",
        showlabel: true
      },
      image: {
        element: 'image',
        value: '',
        validation: {
          required: true
        },
        valid: true
      }
    }
  };

  updateForm(element) {
    const newFormdata = { ...this.state.formdata };
    const newElement = { ...newFormdata[element.id] };

    newElement.value = element.event.target.value;

    let valiData = validate(newElement);
    newElement.valid = valiData[0];
    newElement.validationMessage = valiData[1];

    newFormdata[element.id] = newElement;

    this.setState({
      formError: false,
      formdata: newFormdata
    });
  }

  updateFields(match, teamOptions, teams, type, matchId) {
    const newFormdata = {
      ...this.state.formdata
    }

    for(let key in newFormdata){
        if (match){
          newFormdata[key].value = match[key];
          newFormdata[key].valid = true;

        }
        if(key === 'local' || key === 'away') {
          newFormdata[key].config.options = teamOptions;
        }
    }
    
    this.setState({
      matchId,
      formType: type,
      formdata: newFormdata,
      teams
    })
  }

  componentDidMount() {
    const matchId = this.props.match.params.id;
    const getTeams = (match, type) => {
      firebaseTeams.once('value').then(snapshot=> {
        const teams = firebaseLooper(snapshot);
        const teamOptions = [];
        
        snapshot.forEach((childSnapshot) => {
          teamOptions.push({
            key: childSnapshot.val().shotName,
            value: childSnapshot.val().shortName
          })
        });
        this.updateFields(match, teamOptions, teams, type, matchId)
        
      })
    }

    if(!matchId) {
      getTeams(false, 'Add Match')
    } else {
      firebaseDB.ref(`matches/${matchId}`).once('value')
      .then((snapshot) => {
        const match = snapshot.val();
      getTeams(match, 'Edit Match')
      })
    }
  }

  successForm(message) {
    this.setState({
      formSuccess:  message
    });

    setTimeout(() => {
      this.setState({
        formSuccess: ''
      });
    }, 2000)
  }

  submitForm(event) {
    event.preventDefault();

    let dataToSubmit = {};
    let formIsValid = true;

    for (let key in this.state.formdata) {
      dataToSubmit[key] = this.state.formdata[key].value;
      formIsValid = this.state.formdata[key].valid && formIsValid;
    }

    this.state.teams.forEach((team) => {
      if(team.shortName === dataToSubmit.local){
        dataToSubmit['localThmb'] = team.thmb
      }
      if(team.shortName === dataToSubmit.away){
        dataToSubmit['awayThmb'] = team.thmb
      }
    })

    if (formIsValid) {
      if(this.state.formType === 'Edit Match'){
        firebaseDB.ref(`matches/${this.state.matchId}`)
        .update(dataToSubmit)
        .then(()=>{
          this.successForm('Updated correctly');
        })
        .catch((e) =>{
          this.setState({ formError: true})
        })
      } else {
        firebaseMatches.push(dataToSubmit).then(() => {
          this.props.history.push('/admin_matches');
        }).catch((e) => {
          this.setState({ formError: true})
        })
      }

    } else {
      this.setState({
        formError: true
      });
    }
  }


  render() {
    return (
      <AdminLayout>
        <div className="editplayers_dialog_wrapper">
          <h2>{this.state.formType}</h2>
          <div>
            <form onSubmit={event => this.submitForm(event)}>

              <Fileuploader
                dir="players"
                tag={"Player image"}
                defaultImg={this.state.defaultImg}
              />

              <FormField
                id={"date"}
                formdata={this.state.formdata.date}
                change={element => this.updateForm(element)}
              />

              <div className="select_team_layout">
                <div className="label_inputs">Local</div>
                <div className="wrapper">
                  <div className="left">
                    <FormField
                      id={"local"}
                      formdata={this.state.formdata.local}
                      change={element => this.updateForm(element)}
                    />
                  </div>
                  <div>
                    <FormField
                      id={"resultLocal"}
                      formdata={this.state.formdata.resultLocal}
                      change={element => this.updateForm(element)}
                    />
                  </div>
                </div>
              </div>

              <div className="select_team_layout">
                <div className="label_inputs">Away</div>
                <div className="wrapper">
                  <div className="left">
                    <FormField
                      id={"away"}
                      formdata={this.state.formdata.away}
                      change={element => this.updateForm(element)}
                    />
                  </div>
                  <div>
                    <FormField
                      id={"resultAway"}
                      formdata={this.state.formdata.resultAway}
                      change={element => this.updateForm(element)}
                    />
                  </div>
                </div>
              </div>

              <div className="split_fields">
                <FormField
                  id={"referee"}
                  formdata={this.state.formdata.referee}
                  change={element => this.updateForm(element)}
                />

                <FormField
                  id={"stadium"}
                  formdata={this.state.formdata.stadium}
                  change={element => this.updateForm(element)}
                />
              </div>

              <div className="split_fields last">
                <FormField
                  id={"result"}
                  formdata={this.state.formdata.result}
                  change={element => this.updateForm(element)}
                />

                <FormField
                  id={"final"}
                  formdata={this.state.formdata.final}
                  change={element => this.updateForm(element)}
                />
              </div>

              <div className="success_label">{this.state.formSuccess}</div>
              {this.state.formError ? 
                <div className="error_label">
                  Something is wrong
                </div>  
                : ''
            }
            <div className="admin_submit">
              <button onClick={(event) => this.submitForm(event)}>
                {this.state.formType}
              </button>
            </div>
            </form>
          </div>
        </div>
      </AdminLayout>
    );
  }
}

export default AddEditPlayers;
