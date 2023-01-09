import { getCookie, setCookie } from "./cookie"
import { convertDate } from "./dateconvert"
import { googleLogout } from '@react-oauth/google';
import { UserSetting } from "./model/user/user";
import { GoogleLoginForm } from "./model/login/google";

googleLogout();

var host;


var Login 				
var Register 			
var Token 				
var Infor 				
var Roles 				
var Session 			
var Password 			
var Setting 			
var InitializeSession 	
var TerminateSession 	
var FetchSlave 			
var FetchSession 		
var FetchInfor 			

const setup = async () => {
	if (host != null)
		return;

	host = await ((await fetch('API.js')).text())
	if (host.length == 0)
		throw new Error("Failt to get API infor");

   	Login 				= `https://${host}/api/account/login`
   	Register 			= `https://${host}/api/account/register`
   	Token 				= `https://${host}/api/account/token/exchange`
   	Infor 				= `https://${host}/api/account/infor`
   	Roles 				= `https://${host}/api/account/roles`
   	Session 			= `https://${host}/api/account/history`
   	Password 			= `https://${host}/api/account/password/update`


   	Setting 			= `https://${host}/api/setting`

   	InitializeSession 	= `https://${host}/api/session/initialize`
   	TerminateSession 	= `https://${host}/api/session/terminate`

   	FetchSlave 			= `https://${host}/api/fetch/node`
   	FetchSession 		= `https://${host}/api/fetch/session`
   	FetchInfor 			= `https://${host}/api/fetch/worker/infor`
}




// local api
export const Dashboard = "/dashboard"

export const Logout = () => {
	setCookie("logout", "true")
	setCookie("token", null, 1)
    googleLogout()
}

/**
 * 
 * @param {string} token 
 * @returns {string} userhub connection string
 */
export const getUserHub = async (token) => {
	await setup();
	return `wss://${host}/Hub/User?token=${token}`
}

/**
 * @returns {Headers}
 */
export const genHeaders = function () : HeadersInit {
	const token = getCookie("token")
	return { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
    }
	
}

/**
 * @param {Response} response 
 * @returns 
 */
async function CheckLoginError(loginResponse) {
	var clone = loginResponse.clone();
	const response = await clone.json()

	if (response.errors == null) 
		return;
	
	response.errors.forEach(element => {
        // TODO
	});

	throw Error ("Fail to login");
}

/**
 * 
 * @param {Response} response 
 * @returns 
 */
async function CheckError(response: Response) {
	if (response.status == 200)
		return;
    

	var clone_body = await (response.clone()).text();
	if (response.status == 401) {
        // TODO
		Logout();  
	} else if (response.status == 400) {
        // TODO
		throw new Error('Bad request')
	} else if (response.status == 500) {
        // TODO
		throw new Error('Server error')
	} else {
        // TODO
		throw new Error('Unknown error')
	}
}





/**
 * 
 * @param {LoginModel} body 
 * @returns 
 */
export const login = async body => {
	await setup();
	var res = await fetch(Login, {
		method: "POST",
		headers: genHeaders(),
		body: JSON.stringify({
			userName: body.username,
			password: body.password
		})
	})
	await CheckError(res);
	await CheckLoginError(res);
	return res;
}

/**
 * 
 * @param {AuthenticationRequest} body 
 * @returns 
 */
export async function tokenExchange (body: GoogleLoginForm): Promise<Response> {
	await setup();
	var res = await fetch(Token, {
		method: "POST",
		headers: genHeaders(),
		body: JSON.stringify({
			token: body.token,
			Validator: body.Validator
		})
	})
	await CheckError(res);
	await CheckLoginError(res);
	return res;
}

/**
 * 
 * @param {UpdatePasswordModel} body 
 * @returns 
 */
export const updatePassword = async body => {
	await setup();
	var res = await fetch(Password, {
		method: "POST",
		headers: genHeaders(),
		body: JSON.stringify({
			Old: body.Old,
			New: body.New
		})
	})
	await CheckError(res);
	await CheckLoginError(res);
	return res;
}

/**
 * 
 * autofill job and convert birthday 
 * @param {RegisterModel} body 
 * @returns {Promise<AuthResponse>}
 */
export const register = async body => {
	await setup();
	body.dob = convertDate(body.dob)
	body.jobs = body.jobs == null ? "nosetJobs" : body.jobs

	var res = await fetch(Register, {
		method: "POST",
		headers: genHeaders(),
		body: JSON.stringify({
			userName: body.username,
			password: body.password,
			email: body.email,
			fullName: body.fullname,
			dateOfBirth: body.dob,
			jobs: body.jobs,
			phoneNumber: body.phonenumber
		})
	})

	await CheckError(res);
	await CheckLoginError(res);
	return res;
}

















/**
 * 
 * @returns {Dictionary<int,string>}
 */
export const fetchWorker = async () => {
	await setup();
	var res = await fetch(FetchSlave, {
		method: "GET",
		headers: genHeaders()
	})
	await CheckError(res);
	return res;
}

/**
 * @returns {Dictionary<int,string>}
 */
export const fetchSession = async () => {
	await setup();
	var res = await fetch(FetchSession, {
		method: "GET",
		headers: genHeaders()
	})
	await CheckError(res)
	return res;
}

/**
 * 
 * @param {int} workerID 
 * @returns {Promise<WorkerNode>}
 */
export const fetchInfor = async (workerID) => {
	await setup();
	var response = await fetch(`${FetchInfor}?WorkerID=${workerID}`, {
		method: "GET",
	})
	await CheckError(response);
	return response;
}

/**
 * 
 * @returns {Promise<Dictionary<int,string>>}
 */
export const getSession = async () => {
	await setup();
	var response = await fetch(Session, {
		method: "GET",
		headers: genHeaders()
	})
	await CheckError(response);
	return response;
}

















/**
 * 
 * @param {int} SlaveID 
 * @returns 
 */
export const terminateSession = async (SlaveID) => {
	await setup();
	var response = await fetch(`${TerminateSession}?WorkerID=${SlaveID}`, {
		method: "DELETE",
		headers: genHeaders()
	})
	await CheckError(response);
	return response;
}

/**
 * 
 * @param {int} SlaveID 
 * @returns 
 */
export const initializeSession = async (SlaveID) => {
	await setup();
	var response = await fetch(`${InitializeSession}?WorkerID=${SlaveID}`, {
		method: "POST",
		headers: genHeaders()
	})
	await CheckError(response);
	return response;
}





/**
 * 
 * @returns { Promise<UserInforModel> } 
 */
export const getInfor = async () => {
	await setup();
	var response = await fetch(Infor, {
		method: "GET",
		headers: genHeaders()
	})
	await CheckError(response);
	return response;
}

/**
 * @returns { Promise<AuthenticationResponse> }
 */
export const getRoles = async () => {
	await setup();
	var response = await fetch(Roles, {
		method: "GET",
		headers: genHeaders()
	});
	await CheckError(response)
	return response;
}



/**
 * 
 * @param {Promise<UserInforModel>} body 
 * @returns 
 */
export const setInfor = async (body) => {
	await setup();
	var response = await fetch(Infor, 
	{
		method: "POST",
		headers: genHeaders(),
		body: JSON.stringify(body)
	})
	await CheckError(response);
	return response;
}

/**
 * 
 * @param {Promise<UserSetting>} body 
 * @returns 
 */
export const setSetting = async (body) => {
	await setup();
	var response = await fetch(`${Setting}`, 
	{
		method: "POST",
		headers: genHeaders(),
		body: JSON.stringify(body)
	});
	await CheckError(response);
	return response;
}



/**
 * @returns {Promise<UserSetting>}
 */
export async function getSetting () : Promise<UserSetting> {
	await setup();
	var response = await fetch(`${Setting}`, {
		method: "GET",
		headers: genHeaders()
	});
	await CheckError(response);
	return response;
}




export const logUI = async(error: string) => {
	console.log(error)
}




