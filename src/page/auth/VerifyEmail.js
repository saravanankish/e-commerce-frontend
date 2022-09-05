import { Typography, Container, Paper, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../../config";

const VerifyEmail = () => {

    const { token } = useParams();
    const navigate = useNavigate();
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState("Not found")

    useEffect(() => {
        if (token) {
            verifyEmail()
        } else {
            setError("Token not found")
        }
        // eslint-disable-next-line
    }, [token])

    const verifyEmail = async () => {
        axios.post(`${backendUrl}/user/verify/email`, token, { headers: { "Content-Type": "text/plain" } }).then(res => {
            if (res.status === 202) {
                setVerified(true)
            }
        }).catch(err => {
            if (err) {
                setError(err.response.data.message);
            }
        })
    }

    return (
        <Container style={{ textAlign: "center", display: "flex", alignItems: "center", height: "100vh", justifyContent: "center" }}>
            <Paper sx={{ padding: 4, width: "50%", minWidth: "300px" }}>
                <Typography
                    variant="h3"
                    color={verified ? "primary" : "error"}
                >
                    Email verification {verified ? "successful" : "failed"}
                </Typography>
                {
                    !verified &&
                    <Typography variant="h6" sx={{ mt: 3 }}>
                        {
                            error !== "" && error
                        }
                    </Typography>
                }
                {
                    verified &&
                    <Typography variant="h6" sx={{ mt: 3 }}>
                        Email was successfully verified
                    </Typography>

                }
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/")}>
                    GO TO Home
                </Button>
            </Paper>
        </Container>
    )
}

export default VerifyEmail;