import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { loginUser, registerUser } from "../../utils/api";
import { setCurrentUser } from "../../redux/actions";
import "./Auth.css";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    first_name: Yup.string()
      .min(2, "Too short")
      .matches(/^[a-zA-Zа-яА-ЯёЁіІїЇєЄ]+$/, "Only letters allowed")
      .required("Required"),
    last_name: Yup.string()
      .min(2, "Too short")
      .matches(/^[a-zA-Zа-яА-ЯёЁіІїЇєЄ]+$/, "Only letters allowed")
      .required("Required"),
    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format",
      )
      .required("Required"),
    username: Yup.string().min(3, "Too short").required("Required"),
    password: Yup.string()
      .min(6, "Min 6 chars")
      .matches(/^(?=.*[a-zA-Z])(?=.*\d)/, "Must contain letters and numbers")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  return (
    <div className="auth-page">
      <div className="auth-container wide">
        <h2>Create Account</h2>
        <Formik
          initialValues={{
            first_name: "",
            last_name: "",
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              await registerUser({
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
                username: values.username,
                password: values.password,
              });

              const loginData = await loginUser({
                email: values.email,
                password: values.password,
              });

              dispatch(setCurrentUser(loginData));
              toast.success(`Welcome, ${values.first_name}!`);
              navigate("/");
            } catch (error) {
              console.error(error);
              const errorMsg = error.message || "";
              if (errorMsg.includes("Email already registered")) {
                setErrors({ email: "This email is already taken" });
              } else if (errorMsg.includes("Username already taken")) {
                setErrors({ username: "This username is already taken" });
              } else {
                toast.error(errorMsg || "Registration failed");
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="auth-form">
              <div className="auth-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <Field
                    type="text"
                    name="first_name"
                    className="auth-input"
                    placeholder="Yaroslav"
                  />
                  <ErrorMessage
                    name="first_name"
                    component="div"
                    className="error-msg"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <Field
                    type="email"
                    name="email"
                    className="auth-input"
                    placeholder="email@example.com"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error-msg"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <Field
                    type="text"
                    name="last_name"
                    className="auth-input"
                    placeholder="Miroshnichenko"
                  />
                  <ErrorMessage
                    name="last_name"
                    component="div"
                    className="error-msg"
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <Field
                    type="password"
                    name="password"
                    className="auth-input"
                    placeholder="Min 6 chars"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error-msg"
                  />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <Field
                    type="text"
                    name="username"
                    className="auth-input"
                    placeholder="User123"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="error-msg"
                  />
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    className="auth-input"
                    placeholder="Repeat password"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="error-msg"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn auth-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>
        <p className="auth-link">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
