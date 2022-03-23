import React, { useState } from "react";
import { signup, signin } from "../library/ajax";

export default function Authenticate({ onSuccess }) {
  const [loginType, setLoginType] = useState(true);

  const submit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    if (loginType) {
      console.log("Login req");
      signin(email, password).then((data) => {
        if (data.uid) onSuccess(data.uid);
        else alert(data.err);
      });
    } else {
      console.log("Signup req");
      const key = await e.target[2].files[0].text();
      signup(email, password, key).then((data) => {
        if (data.uid) onSuccess(data.uid);
        else alert(data.err);
      });
    }
  };

  return (
    <div className="border-2 max-w-md w-full m-auto rounded my-4 shadow-md">
      <h1 className="text-lg font-semibold m-4">
        {loginType ? "Login" : "Signup"}
      </h1>
      <form className="flex flex-col space-y-3 px-4 py-4" onSubmit={submit}>
        <label>Email</label>
        <input
          name="email"
          type="email"
          className="border-2 p-2 rounded focus:shadow-md"
        />
        <label>Password</label>
        <input
          name="password"
          type="password"
          className="border-2 p-2 rounded"
        />
        <span className={loginType ? `hidden` : `space-y-2`}>
          <div className="mr-4">Key File</div>
          <input
            name="MasterKey"
            type="file"
            className="border-2 p-1 rounded w-full"
          />
        </span>
        <button type="submit" className="bg-blue-300 py-2 rounded">
          {loginType ? "Login" : "Signup"}
        </button>
        <button
          type="button"
          className="text-gray-700 py-3"
          onClick={() => setLoginType(!loginType)}
        >
          {loginType ? "Create new user ? Signup" : "Already a user ? Login"}
        </button>
      </form>
    </div>
  );
}
