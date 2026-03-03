import AccessControl "authorization/access-control";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Iter "mo:core/Iter";

actor {
  // Initialize the access control state
  let accessControlState = AccessControl.initState();

  // Initialize auth (first caller becomes admin, others become users)
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    // Admin-only check happens inside
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public type UserProfile = {
    name : Text;
    // Other user metadata if needed
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Transaction Management
  type Transaction = {
    id : Nat;
    owner : Principal;
    date : Text;
    amount : Float;
    transactionType : TransactionType;
    description : Text;
  };

  type TransactionType = {
    #Income;
    #Expense;
  };

  var transactionCounter = 0;
  let transactions = Map.empty<Nat, Transaction>();
  let userTransactions = Map.empty<Principal, [Nat]>();

  public shared ({ caller }) func addTransaction(date : Text, amount : Float, transactionType : TransactionType, description : Text) : async Nat {
    // Only authenticated users can add transactions
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add transactions");
    };

    let transactionId = transactionCounter;
    transactionCounter += 1;

    let transaction : Transaction = {
      id = transactionId;
      owner = caller;
      date;
      amount;
      transactionType;
      description;
    };

    transactions.add(transactionId, transaction);

    // Update user's transaction list
    let userTxs = switch (userTransactions.get(caller)) {
      case (null) { [] };
      case (?txs) { txs };
    };
    userTransactions.add(caller, userTxs.concat([transactionId]));

    transactionId;
  };

  public query ({ caller }) func getTransaction(id : Nat) : async Transaction {
    // Only authenticated users can view transactions
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transactions");
    };

    switch (transactions.get(id)) {
      case (null) { Runtime.trap("Transaction not found") };
      case (?transaction) {
        // Users can only view their own transactions, admins can view all
        if (transaction.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own transactions");
        };
        transaction;
      };
    };
  };

  public query ({ caller }) func getAllTransactions() : async [Transaction] {
    // Only authenticated users can view transactions
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transactions");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);

    let allTransactions = transactions.values().toArray();

    if (isAdmin) {
      // Admins can see all transactions
      allTransactions;
    } else {
      // Users can only see their own transactions
      allTransactions.filter(func(tx) { tx.owner == caller });
    };
  };

  public query ({ caller }) func getUserTransactions(user : Principal) : async [Transaction] {
    // Only authenticated users can view transactions
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transactions");
    };

    // Users can only view their own transactions, admins can view any user's transactions
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own transactions");
    };

    let txIds = switch (userTransactions.get(user)) {
      case (null) { [] };
      case (?ids) { ids };
    };

    txIds.values().map(
      func(id) {
        switch (transactions.get(id)) {
          case (?transaction) { transaction };
          case (null) { Runtime.trap("Transaction not found") };
        };
      }
    ).toArray();
  };

  public query ({ caller }) func getFinancialSummary() : async {
    totalIncome : Float;
    totalExpenses : Float;
    balance : Float;
  } {
    // Only authenticated users can view summaries
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view financial summaries");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);

    var totalIncome : Float = 0.0;
    var totalExpenses : Float = 0.0;

    let allTransactions = transactions.values().toArray();
    for (tx in allTransactions.values()) {
      // Only include user's own transactions, or all if admin
      if (tx.owner == caller or isAdmin) {
        switch (tx.transactionType) {
          case (#Income) { totalIncome += tx.amount };
          case (#Expense) { totalExpenses += tx.amount };
        };
      };
    };

    {
      totalIncome;
      totalExpenses;
      balance = totalIncome - totalExpenses;
    };
  };
};
