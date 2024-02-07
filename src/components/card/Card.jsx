import React from "react";
import Card from "@mui/material/Card";
import enTranslations from "../json_files/en.json";
import esTranslations from "../json_files/es.json";
import { useLanguage } from "../../context/LanguageContext";

import {
  Typography,
  Box,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";
import "./Card.css";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";
import { baseUrl } from "../../config";
import axios from "axios";

const CardBlock = ({
    data,
    loadNextApi,
    setOpportunitiesData,
    opportunitiesData,
    doctorData,
    formData,
    handleChange,
  }) => {
    const { language } = useLanguage();
  const translations = language === "es" ? esTranslations : enTranslations;
  const [loading, setLoading] = React.useState(false);

  const [openPopup, setOpenPopup] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState("");
  const [updateData, setUpdateData] = React.useState({
    procedure_name: "",
    doctor_id: 0,
    stage_history: [
      { stage_name: "lead", timestamp: new Date().toISOString() },
    ],
  });

  const handleOpenPopup = (item) => {
    console.log(" edit true", item);
    setOpenPopup(true);
    setUpdateData(item);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  console.log(updateData, "sadflihsdfiusv");

  const handleUpdatePopup = (field, newValue) => {
    setUpdateData((prev) => ({ ...prev, [field]: newValue }));
    let newArr = [];

    console.log(updateData, "efiehrsfviuer");
    const stageHistory = updateData.stage_history[0];

    const updateEditData = {
      procedure_name: updateData.procedure_name,
      // doctor_id: updateData.doctor.id,
      // stage_history: updateData.stage_history.map((item) => {
      //   return { stage_name: item.stage_name, timestamp: item.timestamp };
      // }),
    };

    debugger;

    axios
      .put(`${baseUrl}/opportunities/${updateData.id}`, updateEditData)
      .then((response) => {
        // console.log("success", response.data);
        console.log(updateData);
        // setOpportunitiesData(updateData);
        console.log(opportunitiesData.data);
        loadNextApi();
      })
      .catch((error) => {
        console.error("error", error);
      });

    handleClosePopup();
  };

  const handleNextButton = (item) => {
    setLoading(true);

    axios
      .patch(`${baseUrl}/opportunities/${item.id}/update_stage_history`)
      .then((response) => {
      console.log("success", response);
        setLoading(false);  
        loadNextApi();
      })
      .catch((error) => {
        console.error("error", error);
        setLoading(false);
      });
  };

  const handleDeleteButton = (item) => {
    setLoading(true);

    axios
      .delete(`${baseUrl}/opportunities/${item.id}`)
      .then((response) => {
        console.log("success", response);
        setLoading(false);
        loadNextApi();
      })
      .catch((error) => {
        console.error("error", error);
        setLoading(false);
      });
  };

  const handleUpdateSelectChange = (item) => {
    const selectedDoctor = doctorData.find((doctor) => doctor.id == item);
    setUpdateData({
      ...updateData,
      doctor: selectedDoctor,
    });
  };

  const handeUpdateEditTimeStamp = (updatedDate) => {
    setUpdateData((prev) => ({
      ...prev,
      stage_history: [
        { ...prev.stage_history, timestamp: moment(updatedDate).format("lll") },
      ],
    }));
  };
  return (
    <>
    {loading && <p>Loading...</p>}
    {data?.length > 0 &&
      data.map((item) => (
        <Card
          sx={{
            marginTop: "10px",
            borderRadius: "8px",
            textTransform: "capitalize",
            boxShadow: "none",
            border: "1px solid #ccc",
          }}
        >
          <Box display={"flex"} flexDirection={"row"} padding={'10px 10px'}>
            <Avatar
              src={item.patient.avatar_url}
              alt="image"
              sx={{ bgcolor: red[500], height: '50px', width: '50px'}}
              aria-label="recipe"
            ></Avatar>
            <Box
              display={"flex"}
              flexDirection={"column"}
              style={{ marginLeft: "10px" }}
            >
              <Typography
                variant="h6"
                style={{textAlign: "left", fontSize: "16px", fontWeight: "bold"}}
                color="black"
              >
                {item.patient.full_name}
                {/* Hello boss */}
              </Typography>
              <Typography
                variant="h6"
                style={{ fontSize: "14px" }}
                color="black"
              >
                {item.patient.gender}, {item.patient.age} years old
                {/* male, 24 year old */}
              </Typography>
            </Box>
          </Box>

          <Box className="card-body">
            <Box
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
            >
              <Box>
                <Typography
                  variant="h6"
                  style={{textAlign: "start", fontSize: "16px", lineHeight: "1.2"}}
                  color="black"
                >
                  {item.procedure_name}
                  {/* Tummy Three */}
                </Typography>
                <Typography
                  variant="h6"
                  style={{textAlign: "start", fontSize: "15px"}}
                  color="black"
                >
                  Dr. {item.doctor.full_name}
                  {/* Dr Harry Master */}
                </Typography>
                {item.stage_history &&
                  item.stage_history.map((stage) => (
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      gap={'10px'}
                    >
                      <Typography style={{ fontSize: "12px", minWidth: "74px", textAlign: 'left' }}>
                        {stage.stage_name}
                      </Typography>
                      <Typography
                        style={{ fontSize: "12px", marginLeft: "2px" }}
                      >
                        {moment(stage.timestamp).format("lll")}
                      </Typography>
                    </Box>
                  ))}
              </Box>
              <Box display={"flex"} flexDirection={"column"} gap={"5px 0px"}>
                <Avatar
                  src={item.doctor.avatar_url}
                  alt="image"
                  sx={{ height: "28px", width: "28px", bgcolor: red[500] }}
                  aria-label="recipe"
                ></Avatar>
                <SkipNextIcon onClick={() => handleNextButton(item)} />
                <EditIcon onClick={() => handleOpenPopup(item)} />
                {/* <DeleteIcon onClick={() => handleDeleteButton(item)}>
                  {" "}
                  <CloseIcon />
                </DeleteIcon> */}
              </Box>
            </Box>
          </Box>
        </Card>
      ))}

    {/* Popup Dialog */}
    {console.log(new Date("Fri Feb 02 2024 19:30:36 GMT+0530"), "f;ishgk")}
    <Dialog open={openPopup} onClose={handleClosePopup}>
      <DialogTitle>
        <div className="popup-header">
          <Typography variant="h6">Opportunity Details</Typography>
          <IconButton
            aria-label="close"
            className="close-popup-btn"
            onClick={handleClosePopup}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <hr />
      </DialogTitle>
      <DialogContent>
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          label="Procedure Name"
          variant="outlined"
          value={updateData.procedure_name}
          onChange={(e) =>
            setUpdateData({ ...updateData, procedure_name: e.target.value })
          }
        />
        <Select
          sx={{ mt: 2, mb: 2 }}
          fullWidth
          defaultValue={updateData?.doctor?.full_name}
          value={updateData?.doctor?.id}
          onChange={(e) => handleUpdateSelectChange(e.target.value)}
        >
          {doctorData?.length > 0 ? (
            doctorData.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.full_name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>{translations["no_doc"]}</MenuItem>
          )}
        </Select>

        <TextField
          variant="outlined"
          type="date"
          fullWidth
          value={selectedDate}
          onChange={(e) => {
            handeUpdateEditTimeStamp(e.target.value);
            setSelectedDate(e.target.value);
          }}
        />
      </DialogContent>
      {console.log(updateData, "dvcsfidhvdifugvbdf")}
      <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={handleUpdatePopup} variant="contained">
          Update
        </Button>
      </Box>
    </Dialog>
  </>
  );
};

export default CardBlock;