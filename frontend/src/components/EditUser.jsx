import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("Female");

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`/api/users/${id}`);

        setName(res.data.name);
        setEmail(res.data.email);
        setGender(res.data.gender);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    getUser();
  }, [id]);

  const updateUser = async (e) => {
    e.preventDefault();

    try {
      await axios.patch(`/api/users/${id}`, {
        name,
        email,
        gender,
      });

      navigate("/");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="container">
      <div className="columns is-centered">
        <div className="column is-half">
          <h1 className="title">Edit User</h1>

          <form onSubmit={updateUser}>
            {/* Name */}
            <div className="field">
              <label className="label">Name</label>

              <div className="control">
                <input
                  type="text"
                  name="name"
                  className="input"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="field">
              <label className="label">Email</label>

              <div className="control">
                <input
                  type="email"
                  name="email"
                  className="input"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Gender */}
            <div className="field">
              <label className="label">Gender</label>

              <div className="control">
                <div className="select is-fullwidth">
                  <select
                    name="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Button */}
            <div className="field">
              <div className="control">
                <button type="submit" className="button is-success">
                  Update User
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
