import { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { publicRequest } from "../requestMethods";
import { mobile } from "../responsive";

// ── Styled components preserved exactly from original ─────────────────────────
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://images.pexels.com/photos/6984661/pexels-photo-6984661.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")
      center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 40%;
  padding: 20px;
  background-color: white;
  ${mobile({ width: "75%" })}
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 20px 10px 0px 0px;
  padding: 10px;
`;

const Agreement = styled.span`
  font-size: 12px;
  margin: 20px 0px;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

const Error = styled.span`
  color: red;
  font-size: 13px;
  margin-top: 10px;
  width: 100%;
  display: block;
`;

const Success = styled.span`
  color: green;
  font-size: 13px;
  margin-top: 10px;
  width: 100%;
  display: block;
`;

const LoginLink = styled.span`
  font-size: 12px;
  margin-top: 12px;
  width: 100%;
  display: block;
  cursor: pointer;
  text-decoration: underline;
  color: teal;
`;
// ─────────────────────────────────────────────────────────────────────────────

const Register = () => {
  const history = useHistory();

  // ── Form state ──────────────────────────────────────────────────────────────
  const [username, setUsername]               = useState("");
  const [email, setEmail]                     = useState("");
  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ── UI state ────────────────────────────────────────────────────────────────
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  // ── Submission handler ──────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Client-side validation
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      // POST /api/auth/register — uses existing backend route in auth.js
      // Backend expects: { username, email, password }
      await publicRequest.post("/auth/register", { username, email, password });

      setSuccess("Account created! Redirecting to login…");
      setTimeout(() => history.push("/login"), 1500);
    } catch (err) {
      // Backend returns 500 with error object on duplicate username/email
      const msg =
        err?.response?.data?.keyPattern?.username ? "Username already taken." :
        err?.response?.data?.keyPattern?.email    ? "Email already registered." :
        "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>CREATE AN ACCOUNT</Title>
        <Form onSubmit={handleSubmit}>
          {/* name and last name are UI-only fields — backend only needs username/email/password */}
          <Input placeholder="name" />
          <Input placeholder="last name" />
          <Input
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            placeholder="confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Agreement>
            By creating an account, I consent to the processing of my personal
            data in accordance with the <b>PRIVACY POLICY</b>
          </Agreement>
          <Button type="submit" disabled={loading}>
            {loading ? "CREATING…" : "CREATE"}
          </Button>

          {error   && <Error>{error}</Error>}
          {success && <Success>{success}</Success>}
        </Form>

        {/* Navigate back to login */}
        <LoginLink onClick={() => history.push("/login")}>
          Already have an account? SIGN IN
        </LoginLink>
      </Wrapper>
    </Container>
  );
};

export default Register;
