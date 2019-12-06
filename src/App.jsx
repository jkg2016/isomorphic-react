import React from "react";
import { connect } from "react-redux";
import QuestionList from "./components/QuestionList";
import QuestionDetail from "./components/QuestionDetail";
import { Route, Link } from "react-router-dom";

const AppDisplay =  ()=>(
  <div>
      <div>
          <Link to={`/`}>
              <h1>Isomorphic React</h1>
          </Link>
      </div>
 
      {/*Specify a route for the main page which renders when the path is empty*/}
      <Route exact path='/' render={()=><QuestionList />}/>

      {/*Specify a route for questions where the detail renders differently depending on the question selected, the ID of which is passed in at render time*/}
      {/*It would be possible to read the current path from within the component during rendering, but this way all data is passed in through props.*/}
      <Route exact path='/questions/:id' render={({match})=><QuestionDetail question_id={match.params.id}/>}/>
  </div>
);

const mapStateToProps = (state, ownProps) => {
  return {
    ...state
  };
};
//export default AppDisplay;
export default connect(mapStateToProps)(AppDisplay);
