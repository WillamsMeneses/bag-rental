import { Checkbox, TextField } from "@mui/material"
import LoginForm from "../components/sections/auth/LoginForm"

const HomePage = () => {
  return (
    <div>
      HomePage
      <div style={{
        display: "flex",
        alignItems: "flex-start"
      }}>
        <TextField placeholder="Test Input" />
        <Checkbox />
      </div>

      Form login

      <div style={{
        marginTop: "20px"
      }}>
        <LoginForm />
      </div>

    </div>
  )
}

export default HomePage