const file = "/csvs/current.csv";

Papa.parse(file, {
  complete: function(results) {
    const data = results.data;
    const teams = {};  // Object to store aggregated team data
    
    // Process each row (expecting at least 25 columns: indexes 0–24)
    data.forEach(row => {
      if (row.length < 25) return;
      
      const teamNumber = row[0].trim();
      const matchNumber = row[2].trim();
      
      // Parse numeric columns (using 0 if not a valid number)
      const moved           = parseFloat(row[3])  || 0;
      const coralL1         = parseFloat(row[4])  || 0;
      const coralL2         = parseFloat(row[5])  || 0;
      const coralL3         = parseFloat(row[6])  || 0;
      const coralL4         = parseFloat(row[7])  || 0;
      const bargeAlgae      = parseFloat(row[8])  || 0;
      const processorAlgae  = parseFloat(row[9])  || 0;
      const dislodgedAlgae  = parseFloat(row[10]) || 0;
      const dislodgedTeleop = parseFloat(row[11]) || 0;
      const pickupLocation  = parseInt(row[12], 10) || 0;
      const coralL1Teleop   = parseFloat(row[13]) || 0;
      const coralL2Teleop   = parseFloat(row[14]) || 0;
      const coralL3Teleop   = parseFloat(row[15]) || 0;
      const coralL4Teleop   = parseFloat(row[16]) || 0;
      const bargeAlgaeTeleop     = parseFloat(row[17]) || 0;
      const processorAlgaeTeleop = parseFloat(row[18]) || 0;
      const playedDefense   = parseFloat(row[19]) || 0;
      const died            = parseFloat(row[20]) || 0;
      
      // Non-numeric fields
      const endPosition     = row[21].trim();
      const climbingMech    = row[22].trim();
      const card            = row[23].trim();
      const comment         = row[24].trim();
      
      // Initialize the team object if it doesn't exist
      if (!teams[teamNumber]) {
        teams[teamNumber] = {
          teamNumber: teamNumber,
          matchNumbers: [],
          movedSum: 0,
          coralL1Sum: 0,
          coralL2Sum: 0,
          coralL3Sum: 0,
          coralL4Sum: 0,
          bargeAlgaeSum: 0,
          processorAlgaeSum: 0,
          dislodgedAlgaeSum: 0,
          dislodgedTeleopSum: 0,
          pickupMax: 0,
          coralL1TeleopSum: 0,
          coralL2TeleopSum: 0,
          coralL3TeleopSum: 0,
          coralL4TeleopSum: 0,
          bargeAlgaeTeleopSum: 0,
          processorAlgaeTeleopSum: 0,
          playedDefenseSum: 0,
          diedSum: 0,
          endPositionCounts: {},
          climbingMechanism: null,
          cardList: [],
          commentList: [],
          count: 0
        };
      }
      
      const team = teams[teamNumber];
      
      // Collect match numbers and sum numeric values
      team.matchNumbers.push(matchNumber);
      team.movedSum           += moved;
      team.coralL1Sum         += coralL1;
      team.coralL2Sum         += coralL2;
      team.coralL3Sum         += coralL3;
      team.coralL4Sum         += coralL4;
      team.bargeAlgaeSum      += bargeAlgae;
      team.processorAlgaeSum  += processorAlgae;
      team.dislodgedAlgaeSum  += dislodgedAlgae;
      team.dislodgedTeleopSum += dislodgedTeleop;
      team.pickupMax = Math.max(team.pickupMax, pickupLocation);
      team.coralL1TeleopSum   += coralL1Teleop;
      team.coralL2TeleopSum   += coralL2Teleop;
      team.coralL3TeleopSum   += coralL3Teleop;
      team.coralL4TeleopSum   += coralL4Teleop;
      team.bargeAlgaeTeleopSum     += bargeAlgaeTeleop;
      team.processorAlgaeTeleopSum += processorAlgaeTeleop;
      team.playedDefenseSum   += playedDefense;
      team.diedSum            += died;
      
      // Tally end position occurrences (e.g., "No", "P", "Sc", "Dc")
      if (endPosition) {
        team.endPositionCounts[endPosition] = (team.endPositionCounts[endPosition] || 0) + 1;
      }
      
      // For climbing mechanism, record the first instance that isn’t "DC"
      if (!team.climbingMechanism && climbingMech && climbingMech !== "DC") {
        team.climbingMechanism = climbingMech;
      }
      
      // For cards, only record "Yellow" or "Red"
      if (card === "Yellow" || card === "Red") {
        team.cardList.push(card);
      }
      
      // Append comments
      if (comment) {
        team.commentList.push(comment);
      }
      
      team.count++;
    });
    
    // Mapping for pickup location values
    const pickupMapping = {
      1: "None",
      2: "Ground",
      3: "Human Player",
      4: "Both"
    };
    
    // Clear out any previous content
    const container = document.getElementById("teamsContainer");
    container.innerHTML = "";
    
    // For each team, create a collapsible dropdown (using <details>)
    Object.values(teams).forEach(team => {
      const count = team.count;
      
      // Compute raw averages as numbers for calculation
      const movedAvgNum              = team.movedSum / count;
      const coralL1AvgNum            = team.coralL1Sum / count;
      const coralL2AvgNum            = team.coralL2Sum / count;
      const coralL3AvgNum            = team.coralL3Sum / count;
      const coralL4AvgNum            = team.coralL4Sum / count;
      const bargeAlgaeAvgNum         = team.bargeAlgaeSum / count;
      const processorAlgaeAvgNum     = team.processorAlgaeSum / count;
      const coralL1TeleopAvgNum      = team.coralL1TeleopSum / count;
      const coralL2TeleopAvgNum      = team.coralL2TeleopSum / count;
      const coralL3TeleopAvgNum      = team.coralL3TeleopSum / count;
      const coralL4TeleopAvgNum      = team.coralL4TeleopSum / count;
      const bargeAlgaeTeleopAvgNum   = team.bargeAlgaeTeleopSum / count;
      const processorAlgaeTeleopAvgNum = team.processorAlgaeTeleopSum / count;
      
      // Compute averages as formatted strings for display
      const movedAvg           = movedAvgNum.toFixed(2);
      const coralL1Avg         = coralL1AvgNum.toFixed(2);
      const coralL2Avg         = coralL2AvgNum.toFixed(2);
      const coralL3Avg         = coralL3AvgNum.toFixed(2);
      const coralL4Avg         = coralL4AvgNum.toFixed(2);
      const bargeAlgaeAvg      = bargeAlgaeAvgNum.toFixed(2);
      const processorAlgaeAvg  = processorAlgaeAvgNum.toFixed(2);
      const dislodgedAlgaeAvg  = (team.dislodgedAlgaeSum / count).toFixed(2);
      const dislodgedTeleopAvg = (team.dislodgedTeleopSum / count).toFixed(2);
      const coralL1TeleopAvg   = coralL1TeleopAvgNum.toFixed(2);
      const coralL2TeleopAvg   = coralL2TeleopAvgNum.toFixed(2);
      const coralL3TeleopAvg   = coralL3TeleopAvgNum.toFixed(2);
      const coralL4TeleopAvg   = coralL4TeleopAvgNum.toFixed(2);
      const bargeAlgaeTeleopAvg      = bargeAlgaeTeleopAvgNum.toFixed(2);
      const processorAlgaeTeleopAvg  = processorAlgaeTeleopAvgNum.toFixed(2);
      const playedDefenseAvg   = (team.playedDefenseSum / count).toFixed(2);
      const diedAvg            = (team.diedSum / count).toFixed(2);
      const pickupLabel = pickupMapping[team.pickupMax] || "None";
      
      // Compute the average points earned by the team using the given multipliers
      const avgPoints = (
        (movedAvgNum * 3) +
        (coralL1AvgNum * 3) +
        (coralL2AvgNum * 4) +
        (coralL3AvgNum * 6) +
        (coralL4AvgNum * 7) +
        (processorAlgaeAvgNum * 6) +
        (bargeAlgaeAvgNum * 4) +
        (coralL1TeleopAvgNum * 2) +
        (coralL2TeleopAvgNum * 3) +
        (coralL3TeleopAvgNum * 4) +
        (coralL4TeleopAvgNum * 5) +
        (processorAlgaeTeleopAvgNum * 6) +
        (bargeAlgaeTeleopAvgNum * 4)
      ).toFixed(2);
      
      // Build end position counts string (e.g., "No: 2 P: 1 Sc: 0 Dc: 3")
      let endPositionsStr = "";
      for (const pos in team.endPositionCounts) {
        endPositionsStr += `${pos}: ${team.endPositionCounts[pos]} `;
      }
      endPositionsStr = endPositionsStr.trim();
      
      // Determine climbing mechanism; default to "DC" if none was found
      const climbingMechanism = team.climbingMechanism ? team.climbingMechanism : "DC";
      
      // Summarize cards (only Yellow/Red)
      const cardCounts = team.cardList.reduce((acc, card) => {
        acc[card] = (acc[card] || 0) + 1;
        return acc;
      }, {});
      let cardStr = "";
      for (const card in cardCounts) {
        cardStr += `${card}: ${cardCounts[card]} `;
      }
      cardStr = cardStr.trim();
      
      // Concatenate comments (each truncated to about 50 characters)
      const commentsStr = team.commentList.map(c => c.substring(0,50)).join(" | ");
      
      // Construct a detailed text summary with the additional Avg Points field
      const detailsText = `
      Matches: [${team.matchNumbers.join(', ')}]
      Avg Points: ${avgPoints}
      Auto:
      Moved Avg: ${movedAvg}
      Coral L1: ${coralL1Avg} | Coral L2: ${coralL2Avg} | Coral L3: ${coralL3Avg} | Coral L4: ${coralL4Avg}
      Barge: ${bargeAlgaeAvg} | Processor: ${processorAlgaeAvg}
      Dislodged: ${dislodgedAlgaeAvg} 
      Teleop:
      Dislodged: ${dislodgedTeleopAvg}
      Teleop Coral L1: ${coralL1TeleopAvg} | Teleop Coral L2: ${coralL2TeleopAvg}
      Teleop Coral L3: ${coralL3TeleopAvg} | Teleop Coral L4: ${coralL4TeleopAvg}
      Teleop Barge: ${bargeAlgaeTeleopAvg} | Teleop Processor: ${processorAlgaeTeleopAvg}
      Defense: ${playedDefenseAvg} | Died: ${diedAvg}
      Pickup: ${pickupLabel}
      Endgame:
      End Pos: [${endPositionsStr}]
      Climb: ${climbingMechanism}
      Cards: [${cardStr}]
      Comments: [${commentsStr}]
      `;
      
      // Create the details element and set its inner HTML
      const detailsEl = document.createElement("details");
      const summaryEl = document.createElement("summary");
      summaryEl.textContent = `Team ${team.teamNumber}`;
      detailsEl.appendChild(summaryEl);
      
      const infoEl = document.createElement("pre");
      infoEl.classList.add("team-info");
      infoEl.textContent = detailsText;
      detailsEl.appendChild(infoEl);
      
      // Append the details block to the container
      container.appendChild(detailsEl);
    });
  },
  error: function(err) {
    console.error("Error parsing CSV:", err);
  }
});
