class Patient {
    constructor(name, severity) {
        this.name = name;
        this.severity = parseInt(severity); 
        this.timestamp = Date.now(); 
    }
}

class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(patient) {
        let added = false;
        
        for (let i = 0; i < this.items.length; i++) {
            if (patient.severity < this.items[i].severity) {
                this.items.splice(i, 0, patient);
                added = true;
                break;
            }
        }
        
        if (!added) {
            this.items.push(patient);
        }
    }

    dequeue() {
        if (this.isEmpty()) return null;
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

const hospitalQueue = new PriorityQueue();
const estimatedTimePerPatient = 15; // Assume 15 mins per patient for estimation
function showPopup(msg) {
    document.getElementById("popupText").innerText = msg;
    document.getElementById("popup").style.display = "block";
}
function addPatient() {
    const nameInput = document.getElementById('patientName');
    const severityInput = document.getElementById('severity');
    
    if (nameInput.value.trim() === '') {
    showPopup("Please enter a patient name.");
    return;
}

    const newPatient = new Patient(nameInput.value, severityInput.value);
    hospitalQueue.enqueue(newPatient); 
    
    nameInput.value = ''; 
    updateDashboard(); 
}

function treatNextPatient() {
    const treatedPatient = hospitalQueue.dequeue();
    if (treatedPatient) {
        showPopup("Now treating: " + treatedPatient.name);
        updateDashboard();
    } else {
        showPopup("The queue is empty.");
    }
}

function updateDashboard() {
    const queueListDiv = document.getElementById('queueList');
    queueListDiv.innerHTML = ''; 

    if (hospitalQueue.isEmpty()) {
        queueListDiv.innerHTML = '<p class="empty-queue">Queue is currently empty.</p>';
        return;
    }

    hospitalQueue.items.forEach((patient, index) => {
        const waitTime = index * estimatedTimePerPatient; 
        
        const priorityLabels = {1: "Critical", 2: "Urgent", 3: "Standard", 4: "Non-Urgent"};
        
        const patientDiv = document.createElement('div');
        patientDiv.className = `patient-item priority-${patient.severity}`;
        
        patientDiv.innerHTML = `
            <div class="patient-info">
                <strong>${patient.name}</strong>
                <span>Level ${patient.severity} - ${priorityLabels[patient.severity]}</span>
            </div>
            <div class="patient-stats">
                <div>Pos: #${index + 1}</div>
                <div>Est. Wait: ${waitTime} mins</div>
            </div>
        `;
        
        queueListDiv.appendChild(patientDiv);
    });
}