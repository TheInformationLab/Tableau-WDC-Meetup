(function () {

  'use strict';

  var group = [{
      id: "category",
      alias: "Category",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "city",
      alias: "City",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "country",
      alias: "Country",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "created",
      alias: "Created",
      dataType: tableau.dataTypeEnum.datetime
  }, {
      id: "description",
      alias: "Description (HTML)",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "id",
      alias: "Group ID",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "join_mode",
      alias: "Join Mode",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "photo_link",
      alias: "Group Photo",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "lat",
      alias: "Latitude",
      dataType: tableau.dataTypeEnum.float
  }, {
      id: "link",
      alias: "Group URL",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "localized_country_name",
      alias: "Country (Localised)",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "localized_location",
      alias: "Location (Localised)",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "lon",
      alias: "Longitude",
      dataType: tableau.dataTypeEnum.float
  }, {
      id: "members",
      alias: "Number of Members",
      dataType: tableau.dataTypeEnum.int
  }, {
      id: "id",
      alias: "Group ID",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "name",
      alias: "Group Name",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "state",
      alias: "State",
      dataType: tableau.dataTypeEnum.int
  }, {
      id: "status",
      alias: "Status",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "timezone",
      alias: "Timezone",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "untranslated_city",
      alias: "City (Untranslated)",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "urlname",
      alias: "Meetup URL Name",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "visibility",
      alias: "Visibility",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "who",
      alias: "Who",
      dataType: tableau.dataTypeEnum.string
  }];

  var event = [{
      id: "attendance_count",
      alias: "Attendance Count",
      dataType: tableau.dataTypeEnum.int
  }, {
      id: "comment_count",
      alias: "Comment Count",
      dataType: tableau.dataTypeEnum.int
  }, {
      id: "created",
      alias: "Created",
      dataType: tableau.dataTypeEnum.datetime
  }, {
      id: "description",
      alias: "Description",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "duration",
      alias: "Duration",
      dataType: tableau.dataTypeEnum.int
  }, {
      id: "group_id",
      alias: "Group ID",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "id",
      alias: "Event ID",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "link",
      alias: "Link",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "local_date",
      alias: "Local Date",
      dataType: tableau.dataTypeEnum.date
  }, {
      id: "local_time",
      alias: "Local Time",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "manual_attendance_count",
      alias: "Manual Attendance Count",
      dataType: tableau.dataTypeEnum.int
  }, {
      id: "name",
      alias: "Event Name",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "status",
      alias: "Event Status",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "time",
      alias: "Event Time",
      dataType: tableau.dataTypeEnum.datetime
  }, {
      id: "updated",
      alias: "Updated",
      dataType: tableau.dataTypeEnum.datetime
  }, {
      id: "status",
      alias: "Event Status",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "venue_id",
      alias: "Venue ID",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "waitlist_count",
      alias: "Waitlist Count",
      dataType: tableau.dataTypeEnum.int
  }, {
      id: "yes_rsvp_count",
      alias: "RSVP Yes Count",
      dataType: tableau.dataTypeEnum.int
  }];

  var member = [{
      id: "id",
      alias: "Member ID",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "name",
      alias: "Name",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "bio",
      alias: "Bio",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "status",
      alias: "Status",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "joined",
      alias: "Date Joined Meetup",
      dataType: tableau.dataTypeEnum.date
  }, {
      id: "joined_group",
      alias: "Date Joined Group",
      dataType: tableau.dataTypeEnum.date
  }, {
      id: "last_visited",
      alias: "Date Last Visitied Group",
      dataType: tableau.dataTypeEnum.date
  }, {
      id: "city",
      alias: "City",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "country",
      alias: "Country",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "localized_country_name",
      alias: "Country Name (localised)",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "lat",
      alias: "Latitude",
      dataType: tableau.dataTypeEnum.float
  }, {
      id: "lon",
      alias: "Longitude",
      dataType: tableau.dataTypeEnum.float
  }, {
      id: "photo_link",
      alias: "Photo Link",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "group_id",
      alias: "Group ID",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "intro",
      alias: "Member Intro",
      dataType: tableau.dataTypeEnum.string
  }, {
      id: "is_pro_admin",
      alias: "Is Pro Admin",
      dataType: tableau.dataTypeEnum.bool
  }];

  var venue = [
    {
      id: "rating_count",
      alias: "Rating Count",
      dataType: tableau.dataTypeEnum.int
    },
    {
      id: "rating",
      alias: "Rating",
      dataType: tableau.dataTypeEnum.int
    },
    {
      id: "visibility",
      alias: "Visibility",
      dataType: tableau.dataTypeEnum.string
    },
    {
      id: "state",
      alias: "State",
      dataType: tableau.dataTypeEnum.string
    },
    {
      id: "name",
      alias: "Name",
      dataType: tableau.dataTypeEnum.string
    },
    {
      id: "lon",
      alias: "Longitude",
      dataType: tableau.dataTypeEnum.float
    },
    {
      id: "lat",
      alias: "Latitude",
      dataType: tableau.dataTypeEnum.float
    },
    {
      id: "localized_country_name",
      alias: "Localised Country Name",
      dataType: tableau.dataTypeEnum.string
    },
    {
      id: "country",
      alias: "Country",
      dataType: tableau.dataTypeEnum.string
    },
    {
      id: "city",
      alias: "City",
      dataType: tableau.dataTypeEnum.string
    },
    {
      id: "address_1",
      alias: "Address",
      dataType: tableau.dataTypeEnum.string
    },
    {
      id: "id",
      alias: "Venue ID",
      dataType: tableau.dataTypeEnum.string
    }
  ]

  var myGroups = {
    id: "myGroups",
    alias: "My Groups",
    columns: group
  };

  var groupEvents = {
    id: "groupEvents",
    alias: "Group Events",
    columns: event
  };

  var groupMembers = {
    id: "groupMembers",
    alias: "Group Members",
    columns: member
  };

  var groupVenues = {
    id: "groupVenues",
    alias: "Group Venues",
    columns: venue
  }

  var groupsEventsJoin = {
    "alias": "Events by Group",
    "tables": [{
      "id" : myGroups.id,
      "alias" : myGroups.alias
    }, {
      "id" : groupEvents.id,
      "alias" : groupEvents.alias
    }],
    "joins" : [{
      "left": {
        "tableAlias": myGroups.alias,
        "columnId" : "id"
      },
      "right": {
        "tableAlias" : groupEvents.alias,
        "columnId" : "group_id"
      },
      "joinType": "inner"
    }]
  };

  var groupsMembersJoin = {
    "alias": "Members by Group",
    "tables": [{
      "id" : myGroups.id,
      "alias" : myGroups.alias
    }, {
      "id" : groupMembers.id,
      "alias" : groupMembers.alias
    }],
    "joins" : [{
      "left": {
        "tableAlias": myGroups.alias,
        "columnId" : "id"
      },
      "right": {
        "tableAlias" : groupMembers.alias,
        "columnId" : "group_id"
      },
      "joinType": "inner"
    }]
  };

  var groupEventsVenuesJoin = {
    "alias": "Group Events with Venues",
    "tables": [{
      "id" : groupEvents.id,
      "alias" : groupEvents.alias
    }, {
      "id" : groupVenues.id,
      "alias" : groupVenues.alias
    }],
    "joins" : [{
      "left": {
        "tableAlias": groupEvents.alias,
        "columnId" : "venue_id"
      },
      "right": {
        "tableAlias" : groupVenues.alias,
        "columnId" : "id"
      },
      "joinType": "left"
    }]
  };

  window.schema = {
    tables: [
      myGroups,
      groupEvents,
      groupMembers,
      groupVenues
    ],
    joins: [
      groupsEventsJoin,
      groupsMembersJoin,
      groupEventsVenuesJoin
    ]
  }

}());
