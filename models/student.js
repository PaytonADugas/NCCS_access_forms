const mongoose = require('mongoose');


//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Define a schema
var Schema = mongoose.Schema;

var StudentModelSchema = new Schema({
  owner: String,
  student_id: String,
  last_name: String,
  first_name: String,
  birth_date: String,
  age: String,
  gender: String,
  disabilities: String,
  school_year: String,
  grade: String,
  record_permission: String,
  previous_school_year: String,
  previous_school: String,
  previous_school_mailing_address: String,
  previous_school_mailing_address2: String,
  previous_school_city: String,
  previous_school_state: String,
  previous_school_zip: String,
  previous_school_been_suspended: String,
  father_name: String,
  father_employment: String,
  mother_name: String,
  mother_employment: String,
  family_address: String,
  family_address2: String,
  family_city: String,
  family_state: String,
  family_zip: String,
  family_phone: String,
  family_email: String,
  student_living_with: String,
  student_guardian: String,
  family_church: String,
  HSLDA_membership: String,
  primary_teacher: String,
  high_school_eduication: String,
  high_school_attended: String,
  high_school_graduation: String,
  college_eduication: String,
  college_attended: String,
  college_graduation: String,
  college_degree: String,
  list_training: String,
  membership_agreement: String,
  curriculum_agreement: String,
  record_keeping_agreement: String,
  parent_participation_agreement: String,
  parent_home_agreement: String,
  attendance_grades_agreement: String,
  course_of_study_course_description_agreement: String,
  read_handbook_agreement: String,
  change_schools_agreement: String,
  enrolment_dismissal_agreement: String,
  parent_direction_agreement: String,
  read_agreement: String,
  father_signature: String,
  father_sign_date: String,
  mother_signature: String,
  mother_sign_date: String,
  HSLDA_membership_id: String,
  HSLDA_membership_expires: String,
  notes: String,
  dateRecieved: String,
  feesRecieved: String,
  lettersSent: String,
  tdap: String
});

// Export Student Model
module.export = mongoose.model('student', StudentModelSchema );
