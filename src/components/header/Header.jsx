import "./Header.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../config";
import enTranslations from "../json_files/en.json";
import esTranslations from "../json_files/es.json";
import { useLanguage } from "../../context/LanguageContext";

import {
  Button,
  TextField,
  Modal,
  Box,
  Typography,
  Container,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Grid,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { lightBlue } from "@mui/material/colors";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import SearchIcon from "@mui/icons-material/Search";
const Header = ({ setOpportunitiesData, loadNextApi }) => {
  const { language } = useLanguage();
  const initialFormData = {
    firstName: "",
    lastName: "",
    role: "",
    gender: "",
    age: 0,
    dateOfBirth: "",
    Image: null,
  };
  const translations = language === "es" ? esTranslations : enTranslations;
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [validationErrors, setValidationErrors] = useState({});

  const [searchText, setSearchText] = useState("");

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${baseUrl}/opportunities?search=${searchText}`)
      console.log("success", response.data.data);
      setOpportunitiesData(response.data);
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchText]);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);

    setFormData((prevFormData) => ({
      ...prevFormData,
      firstName: "",
      lastName: "",
      role: "",
      gender: "",
      age: 0,
      dateOfBirth: "",
      Image: null,
    }));
    setValidationErrors({});
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      Image: file || null,
    }));
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: null,
    }));
    if (fieldName === "dateOfBirth") {
      const birthDate = new Date(value);
      const currentDate = new Date();
      const age = currentDate.getFullYear() - birthDate.getFullYear();
      setFormData((prevFormData) => ({
        ...prevFormData,
        age,
      }));
    }
  };

  const handleSave = async () => {
    // Create FormData object to send member data
    const addMemberData = new FormData();
    addMemberData.append("member[first_name]", formData.firstName);
    addMemberData.append("member[last_name]", formData.lastName);
    addMemberData.append("member[gender]", formData.gender);
    addMemberData.append("member[age]", formData.age);
    addMemberData.append("member[role]", formData.role);
    addMemberData.append("member[avatar]", formData.Image, "file");
    
    try {
      // Send POST request to save member data
      const response = await axios.post(`${baseUrl}/members`, addMemberData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      loadNextApi();
      closeModal();
    } catch (error) {
      console.error("error", error);
    }
    const errors = {};

    const requiredFields = ["firstName", "lastName", "role", "gender", "dateOfBirth", "Image"];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <h1> {translations["navbar.title"]}</h1>
          <div className="navbar-buttons">
            <button className="add-member-btn" onClick={openModal}>
              {translations["navbar.addMember"]}
            </button>
            <Box display={"flex"}>
              <div
              className="search-input"
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "305px",
                }}
              >
                <SearchIcon
                  style={{
                    color: "gray",
                    position: "absolute",
                    marginLeft: "8px",
                  }}
                />
                <input
                  type="text"
                  placeholder={translations["search.placeholder"]}
                  value={searchText}
                  style={{
                    width: "100%",
                    padding: "8px 15px 8px 40px",
                    borderRadius: "30px",
                    border: "1px solid #ccc",
                    fontSize: "16px",
                  }}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </Box>
          </div>
        </div>
      </nav>

      {/* Material-UI Modal */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <Container
          maxWidth="sm"
          sx={{ mt: 1, p: 1, bgcolor: "background.paper", borderRadius: 2, position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', left: '50%' }}
        >
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mb: -2, mr: -2 }}
          >
            <IconButton onClick={closeModal} size="large">
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="h5" gutterBottom>
            {translations["navbar.addMember"]}
          </Typography>

          <hr />

          <InputLabel htmlFor="upload-image" style={{ cursor: "pointer" }}>
            <input
              type="file"
              id="upload-image"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
              error={Boolean(validationErrors.Image)}
              helperText={validationErrors.Image}
            />
            {formData.Image ? (
              <>
                <Box
                  display={"flex"}
                  flexDirection={"row"}
                  justifyContent={"space-between"}
                >
                  <Box>
                    <Avatar
                      src={URL.createObjectURL(formData.Image)}
                      alt="Uploaded Image"
                      sx={{
                        height: "50px",
                        width: "50px",
                        bgcolor: lightBlue[500],
                        borderRadius: "50%",
                        margin: "auto",
                        mb: 2,
                        ml: 0,
                        cursor: "pointer",
                      }}
                    />
                  </Box>
                  <Box sx={{ mr: 40, mt: 1 }}>
                    <Typography>{translations["image.SuccMessage"]}</Typography>
                  </Box>
                </Box>
              </>
            ) : (
              <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"space-between"}
              >
                <Box>
                  <PersonAddRoundedIcon
                    sx={{
                      fontSize: 40,
                      bgcolor: lightBlue[500],
                      borderRadius: "50%",
                      color: "#fff",
                      margin: "auto",
                      mb: 2,
                      cursor: "pointer",
                    }}
                  />
                </Box>
                <Box sx={{ mr: 42, mt: 1 }}>
                  <Typography> {translations["image.message"]}</Typography>
                </Box>
              </Box>
            )}
          </InputLabel>

          {/* Form groups for First Name, Last Name, Role, Gender, and Date of Birth */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label={translations["memFirstName"]}
              variant="outlined"
              onChange={(e) => handleFieldChange("firstName", e.target.value)}
              error={Boolean(validationErrors.firstName)}
              helperText={validationErrors.firstName}
            />
            <TextField
              label={translations["memLastName"]}
              variant="outlined"
              onChange={(e) => handleFieldChange("lastName", e.target.value)}
              error={Boolean(validationErrors.lastName)}
              helperText={validationErrors.lastName}
            />
            <FormControl variant="outlined">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                label="Role"
                labelId="role-label"
                onChange={(e) => handleFieldChange("role", e.target.value)}
                error={Boolean(validationErrors.role)}
              >
                <MenuItem value="doctor">{translations["doctor"]}</MenuItem>
                <MenuItem value="patient">{translations["patient"]}</MenuItem>
              </Select>
              {validationErrors.role && (
                <div style={{ color: "red", fontSize: "0.75rem" }}>
                  {validationErrors.role}
                </div>
              )}
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="gender-label">
                    {translations["memGender"]}
                  </InputLabel>
                  <Select
                    label="Gender"
                    labelId="gender-label"
                    onChange={(e) =>
                      handleFieldChange("gender", e.target.value)
                    }
                    error={Boolean(validationErrors.gender)}
                  >
                    <MenuItem value="male">{translations["male"]}</MenuItem>
                    <MenuItem value="female">{translations["female"]}</MenuItem>
                  </Select>
                  {validationErrors.gender && (
                    <div style={{ color: "red", fontSize: "0.75rem" }}>
                      {validationErrors.gender}
                    </div>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  type="date"
                  fullWidth
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleFieldChange("dateOfBirth", e.target.value)
                  }
                  error={Boolean(validationErrors.dateOfBirth)}
                  helperText={validationErrors.dateOfBirth}
                />
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}
          >
            <Button
              variant="contained"
              className="save_member"
              onClick={handleSave}
              sx={{ mr: 1 }}
            >
              {translations["memSave"]}
            </Button>
          </Box>
        </Container>
      </Modal>
      <div className="cards-container"></div>
    </>
  );
};

export default Header;
