import gql from 'graphql-tag';
import uuid from 'uuid/v4';
import { EXPERIMENT_MUTATION } from '../../../../constants/base';

export default (experiment) => {
  const id = experiment.id ? experiment.id : uuid();

  return gql`mutation {
        ${EXPERIMENT_MUTATION}(
            uid:"${localStorage.getItem('uid')}"
            id:"${id}"
            name:"${experiment.name}"
            description:"${experiment.description}"
            begin:"${experiment.begin}"
            end:"${experiment.end}"
            location:"${experiment.location}"
            numberOfTrials:${experiment.numberOfTrials}
          ){
            begin
            end
            id
            location
            numberOfTrials
            project {
              id
              name
              description
              status
             }  
        }
      }`;
};
