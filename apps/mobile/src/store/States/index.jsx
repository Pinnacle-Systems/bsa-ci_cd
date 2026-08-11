import { Master_state, Permission_Master_state, Permission_state } from "@Redux/States/Master/Master";
import { Onduty_Master_state } from "@Redux/States/Master/Onduty";
import { Fuel_state } from "@Redux/States/Report/Fuel_Report_Input";
import { Advance_state } from "@Redux/States/Transactions/AdvanceMeta.js";
import { Leave_dash_State } from "@Redux/States/Transactions/DashBoard/Leave_Report";
import { Leave_state } from "@Redux/States/Transactions/LeaveMeta.js";
import { Onduty_state } from "@Redux/States/Transactions/OnDutyMeta.js";



export   const   AllInputGroup={Master_state,Permission_state,Permission_Master_state,Leave_state,Advance_state,Leave_dash_State,Onduty_state,Onduty_Master_state,Fuel_state}