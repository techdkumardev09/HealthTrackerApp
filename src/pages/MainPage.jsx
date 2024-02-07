import React, { useEffect, useState } from "react";
import axios from "axios";
import enTranslations from "../components/json_files/en.json";
import esTranslations from "../components/json_files/es.json";
import { useLanguage } from "../context/LanguageContext";

import "./MainPage.css";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// import RecipeReviewCard from "../card/Card";
import { baseUrl } from "../config";
import Header from "../components/header/Header";
import CardBlock from "../components/card/Card";
// import Header from "../Header/Header";

const MainPage = () => {
  const { language } = useLanguage();
  const initialFormData = {
    procedure_name: "",
    patient_id: "",
    doctor_id: "",
    stage_history: [
      {
        timestamp: new Date().toISOString(),
        stage_name: "lead",
      },
    ],
  };
  const translations = language === "es" ? esTranslations : enTranslations;
  const [open, setOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [opportunitiesData, setOpportunitiesData] = useState({});
  const [patientData, setPatientData] = useState({});
  const [doctorData, setDoctorData] = useState({});
  const [formData, setFormData] = useState(initialFormData);

  const loadNextApi = async () => {
    try {
      const response = await axios.get(`${baseUrl}/opportunities`);
      setOpportunitiesData(response.data);
    } catch (error) {
      console.error("Opportunities error:", error);
    }
  };

  useEffect(() => {
    loadNextApi();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorsResponse = await axios.get(`${baseUrl}/members/doctors`);
        setDoctorData(doctorsResponse.data);
      } catch (error) {
        console.error("Doctor ID error:", error);
      }
  
      try {
        const patientsResponse = await axios.get(`${baseUrl}/members/patients`);
        setPatientData(patientsResponse.data);
      } catch (error) {
        console.error("Patient ID error:", error);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    // axios
    //   .get(`${baseUrl}/members/patients`)
    //   .then((response) => {
    //     setPatientData(response.data);
    //   })
    //   .catch((error) => console.log(error, "Patient ID error"));
  }, []);

  const handleFilterCardData = (cardType) => {
    return opportunitiesData.data?.filter(stage => stage.current_stage === cardType) || [];
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormData);
  };

  const handleChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));

    // Clear validation error when the field changes
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [field]: null,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(`${baseUrl}/opportunities`, formData);
      console.log("success", response);
      loadNextApi();
      const errors = {};
      if (!formData.procedure_name.trim()) {
        errors.procedure_name = "Procedure Name is required";
      }
  
      if (!formData.patient_id) {
        errors.patient_id = "Patient ID is required";
      }
  
      if (!formData.doctor_id) {
        errors.doctor_id = "Doctor ID is required";
      }
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }
  
      handleClose();
    } catch (error) {
      console.error("error", error);
    }
  };
  

  return (
    <>
      <Header
        setOpportunitiesData={setOpportunitiesData}
        loadNextApi={loadNextApi}
      />
      <div className="horizontal-layout">
        {/* Content for the first section */}
        <div className="section">
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="h6">
              {translations["stage1.title"]}(
              {opportunitiesData.lead_stage_count})
            </Typography>
            <button className="add-opportunity-btn" onClick={handleOpen}>
              {translations["header.addOpportunity"]}
            </button>
          </Box>
          <CardBlock
            handleChange={handleChange}
            formData={formData}
            doctorData={doctorData}
            opportunitiesData={opportunitiesData}
            setOpportunitiesData={setOpportunitiesData}
            loadNextApi={loadNextApi}
            data={handleFilterCardData("lead")}
          />
        </div>

        {/* Content for the second section */}
        <div className="section">
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="h6">
              {" "}
              {translations["stage2.title"]}(
              {opportunitiesData.qualified_stage_count})
            </Typography>
          </Box>
          <CardBlock
            handleChange={handleChange}
            formData={formData}
            doctorData={doctorData}
            opportunitiesData={opportunitiesData}
            setOpportunitiesData={setOpportunitiesData}
            loadNextApi={loadNextApi}
            data={handleFilterCardData("qualified")}
          />
        </div>

        {/* Content for the third section */}
        <div className="section">
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography>
              {translations["stage3.title"]}(
              {opportunitiesData.booked_stage_count})
            </Typography>
          </Box>
          <CardBlock
            handleChange={handleChange}
            formData={formData}
            doctorData={doctorData}
            opportunitiesData={opportunitiesData}
            setOpportunitiesData={setOpportunitiesData}
            loadNextApi={loadNextApi}
            data={handleFilterCardData("booked")}
          />
        </div>

        {/* Content for the fourth section */}
        <div className="section">
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            {" "}
            <Typography variant="h6">
              {translations["stage4.title"]}(
              {opportunitiesData.treated_stage_count})
            </Typography>
          </Box>
          <CardBlock
            handleChange={handleChange}
            formData={formData}
            doctorData={doctorData}
            opportunitiesData={opportunitiesData}
            setOpportunitiesData={setOpportunitiesData}
            loadNextApi={loadNextApi}
            data={handleFilterCardData("treated")}
          />
        </div>
      </div>

      {/* Popup */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <div className="popup-header">
            <Typography variant="h6">
              {translations["header.addOpportunity"]}
            </Typography>
            <IconButton
              aria-label="close"
              className="close-popup-btn"
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <hr />
        </DialogTitle>

        <DialogContent className="popup-content">
          <br />
          <TextField
            fullWidth
            label={translations["pro_name"]}
            value={formData.procedure_name}
            onChange={(e) => handleChange("procedure_name", e.target.value)}
            error={Boolean(validationErrors.procedure_name)}
            helperText={validationErrors.procedure_name}
          />
          <InputLabel>{translations["pat_Id"]}</InputLabel>
          <Select
            value={formData.patient_id}
            onChange={(e) => handleChange("patient_id", e.target.value)}
            error={Boolean(validationErrors.patient_id)}
          >
            {patientData.length > 0 ? (
              patientData.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.full_name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>{translations["no_pat"]}</MenuItem>
            )}
          </Select>
          {validationErrors.patient_id && (
            <div style={{ color: "red", fontSize: "0.75rem" }}>
              {validationErrors.patient_id}
            </div>
          )}

          <InputLabel>{translations["doc_Id"]}</InputLabel>
          <Select
            value={formData.doctor_id}
            onChange={(e) => handleChange("doctor_id", e.target.value)}
            error={Boolean(validationErrors.doctor_id)}
          >
            {doctorData.length > 0 ? (
              doctorData.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.full_name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>{translations["no_doc"]}</MenuItem>
            )}
          </Select>
          {validationErrors.doctor_id && (
            <div style={{ color: "red", fontSize: "0.75rem" }}>
              {validationErrors.doctor_id}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSave}
            variant="contained"
            className="save_member"
          >
            {translations["memSave"]}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MainPage;
