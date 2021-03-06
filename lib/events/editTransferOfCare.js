/*

 ----------------------------------------------------------------------------
 | qewd-ripple: QEWD-based Middle Tier for Ripple OSI                       |
 |                                                                          |
 | Copyright (c) 2016-18 Ripple Foundation Community Interest Company       |
 | All rights reserved.                                                     |
 |                                                                          |
 | http://rippleosi.org                                                     |
 | Email: code.custodian@rippleosi.org                                      |
 |                                                                          |
 | Author: Rob Tweed, M/Gateway Developments Ltd                            |
 |                                                                          |
 | Licensed under the Apache License, Version 2.0 (the "License");          |
 | you may not use this file except in compliance with the License.         |
 | You may obtain a copy of the License at                                  |
 |                                                                          |
 |     http://www.apache.org/licenses/LICENSE-2.0                           |
 |                                                                          |
 | Unless required by applicable law or agreed to in writing, software      |
 | distributed under the License is distributed on an "AS IS" BASIS,        |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
 | See the License for the specific language governing permissions and      |
 |  limitations under the License.                                          |
 ----------------------------------------------------------------------------

  7 February 2018

*/

function editTransferOfCare(args, callback) {

  var patientId = args.patientId;

  if (typeof patientId === 'undefined' || patientId === '') {
    return callback({error: 'patientId not defined or invalid'});
  }

  var sourceId = args.sourceId;

  if (typeof sourceId === 'undefined' || sourceId === '') {
    return callback({error: 'sourceId not defined or invalid'});
  }

  var data = args.req.body;

  if (typeof data.from === 'undefined' || data.from === '') {
    return callback({error: '"from" field not defined or invalid'});
  }

  if (typeof data.to === 'undefined' || data.to === '') {
    return callback({error: '"to" field not defined or invalid'});
  }

  if (typeof data.transferDateTime === 'undefined' || data.transferDateTime === '') {
    return callback({error: '"transferDateTime" field not defined or invalid'});
  }

  if (typeof data.records === 'undefined' || !Array.isArray(data.records) || data.records.count < 1) {
    return callback({error: '"records" field not defined, not an array or empty'});
  }

  if (typeof data.clinicalSummary === 'undefined' || data.clinicalSummary === '') {
    return callback({error: '"clinicalSummary" field not defined or invalid'});
  }

  if (typeof data.reasonForContact === 'undefined' || data.reasonForContact === '') {
    return callback({error: '"reasonForContact" field not defined or invalid'});
  }

  // data good enough to save

  data.dateUpdated = new Date().getTime();
  data.source = 'qewdDB';

  var docName = this.userDefined.tocDocumentName;
  var tocsDoc = new this.documentStore.DocumentNode(docName);

  var tocDoc = tocsDoc.$(['byPatient', patientId, sourceId]);
  if (!tocDoc.exists) {
    return callback({error: 'No Transfer of Care record exists with the sourceId ' + sourceId});
  }

  // update main document record

  tocDoc.delete();
  tocDoc.setDocument(data);

  // sourceId index does not change

  //tocsDoc.$(['bySourceId', sourceId]).value = patientId;

  callback({updated: true, sourceId: sourceId});
}

module.exports = editTransferOfCare;
