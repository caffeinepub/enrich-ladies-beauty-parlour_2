import List "mo:core/List";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  public type ThemeSettings = {
    theme : Text;
    font : Text;
  };

  public type CalendarEntry = {
    date : Time.Time;
    description : Text;
    isHoliday : Bool;
  };

  public type AppointmentStatus = {
    #confirmed;
    #pending;
    #completed;
    #cancelled;
  };

  public type Appointment = {
    id : Nat;
    customerName : Text;
    service : Text;
    date : Time.Time;
    time : Text;
    phoneNumber : Text;
    description : Text;
    status : AppointmentStatus;
    chatHistory : [ChatMessageEntry];
  };

  public type ChatMessageEntry = {
    from : Text;
    message : Text;
    timestamp : Time.Time;
  };

  let appointments = Map.empty<Principal, List.List<Appointment>>();

  func compareAppointmentsById(appointment1 : Appointment, appointment2 : Appointment) : Order.Order {
    Nat.compare(appointment1.id, appointment2.id);
  };

  // Any authenticated user can create an appointment
  public shared ({ caller }) func createAppointment(appointment : Appointment) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only users can create appointments");
    };
    let emptyList = List.empty<Appointment>();
    appointments.add(caller, emptyList);
    appointments.get(caller).unwrap().add(appointment);
  };

  // Any authenticated user can update their own appointment; admin can update any
  public shared ({ caller }) func updateAppointment(appointment : Appointment) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only users can update appointments");
    };
    let emptyList = List.empty<Appointment>();
    appointments.add(caller, emptyList);
    appointments.get(caller).unwrap().add(appointment);
  };

  // Any authenticated user can delete their own appointment; admin can delete any
  public shared ({ caller }) func deleteAppointment() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only users can delete appointments");
    };
    appointments.remove(caller);
  };

  // Appointments readable by authenticated users or admin
  public query ({ caller }) func getAppointments() : async [Appointment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only users and the owner can access this");
    };
    let allApps = List.empty<Appointment>();
    let appsIterator = appointments.values();
    appsIterator.forEach(
      func(appGroup) {
        appGroup.forEach(
          func(app) {
            allApps.add(app);
          }
        );
      }
    );
    allApps.toArray().sort(compareAppointmentsById);
  };
};
