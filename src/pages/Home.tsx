import AuthForm from "@/components/sections/auth/AuthForm"
import { Checkbox, TextField } from "@mui/material"

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
        <AuthForm />
      </div>

    </div>
  )
}

export default HomePage