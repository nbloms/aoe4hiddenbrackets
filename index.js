const tournamentForm = document.getElementById("getTournamentForm");
const slugField = document.getElementById("slug");

tournamentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const slug = slugField.value;
  if (!slug) {
    console.log("no slug added");
    return;
  }

  getEvent(slug);
});

function getEvent(slug) {
  fetch('https://api.start.gg/gql/alpha', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": "Bearer cd669e6cb878b3e4a4057ff89b493341"
    },
    body: JSON.stringify(
      {
        query: `
        query getEventId($slug: String) {
          event(slug: $slug) {
            id
            name
          }
        }`,
        variables: {
          "slug": slug
        },
      }),
  })
    .then((res) => res.json())
    .then((result) => {
      console.log(`Found event ${result.data.event.name} with ID: ${result.data.event.id}`);
      return result.data.event.id;
    })
    .then((eventId) => getEventSets(eventId));
}

function getEventSets(eventId) {
  fetch('https://api.start.gg/gql/alpha', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": "Bearer cd669e6cb878b3e4a4057ff89b493341"
    },
    body: JSON.stringify({
      query: `
      query event($eventId: ID!) {
        event(id: $eventId) {
          name
          phases {
            name
            phaseGroups {
              nodes {
                sets {
                  nodes {
                    id
                    identifier
                    round
                    fullRoundText
                    displayScore
                    winnerId
                    slots {
                      entrant {
                        id
                        name
                        standing {
                          stats {
                            score {
                              value
                              label
                              displayValue
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
        `,
      variables: {
        "eventId": eventId
      },
    }),
  })
    .then((res) => res.json())
    .then((result) => console.log(result));
}
