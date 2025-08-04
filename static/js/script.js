const API_BASE_URL = "https://9knrfdquid.execute-api.us-east-1.amazonaws.com";
// La linea 1 se actualiza por la URL real de la API con el 
// comando client:prepare o client:deploy del package.json

const today = new Date();

const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
});

let currentMedicalCenters = [];

window.addEventListener('DOMContentLoaded', () => 
{
    const hours = document.querySelector('#eventTime');
    const calendar = document.querySelector('#eventDate');
    const doctorSelect = document.querySelector("#doctor");
    const reserveSection = document.querySelector("#reserve");
    const specialitySelect = document.querySelector("#speciality");
    const medicalCenterSelect = document.querySelector("#medicalCenter");
    
    function setCalendar(step) {
        if(!step){
            calendar.disabled = true;
            calendar.valueAsDate = today;
            return;
        } 

        const minDate = new Date();
        const maxDate = new Date();

        minDate.setHours(0,0,0,0);
        maxDate.setHours(0,0,0,0);

        minDate.setDate(today.getDate() + clover(today.getHours() >= 19));
        maxDate.setDate(maxDate.getDate() + 30);

        calendar.setAttribute('min', formatter.format(minDate));        
        calendar.setAttribute('max', formatter.format(maxDate));

        calendar.valueAsDate = minDate;
        calendar.setAttribute('step', step);
        calendar.disabled = false;        
    }

    document.querySelector("#search").addEventListener('submit', async (event) =>
    {
        event.preventDefault();
        reserveSection.classList.add("hidden");

        const insuredCode = document.querySelector("#insuredCode").value;

        if (insuredCode) {
            const url = `${API_BASE_URL}/catalog/medical-centers/${insuredCode}`;
            const req = await fetch(url);
            const res = await req.json();

            if (res.error) {
                document.querySelector("#reserve form").reset();
                alert(res.message);
                return;
            }

            setCalendar();
            clearSelects(["speciality", "doctor", "medicalCenter", "eventTime"]);

            document.querySelector("#insuredId").value = insuredCode;
            document.querySelector("#countryISO").value = res[0].countryISO;
            document.querySelector("#country u").innerHTML = res[0].countryISO=="PE" ? "Perú" : "Chile";

            for (const center of res) {
                const option = document.createElement("option");
                option.value = center.id;
                option.textContent = `${center.name}`;
                medicalCenterSelect.appendChild(option);

                currentMedicalCenters.push({centerId: center.id, specialties: center.specialties});
            }
            
            medicalCenterSelect.disabled = false;
            reserveSection.classList.remove("hidden");
        }
    });

    medicalCenterSelect.addEventListener('change', (event) =>
    {
        const medicalCenterId = event.target.value;

        const spes = currentMedicalCenters.find(c => c.centerId === medicalCenterId).specialties;

        setCalendar();
        clearSelects(["speciality", "doctor", "eventTime"]);

        for (const spe of spes) {
            const option = document.createElement("option");
            option.value = spe;
            option.textContent = specialities.find(s => s.id === spe).name;
            specialitySelect.appendChild(option);
        }

        specialitySelect.disabled = false;
    });

    specialitySelect.addEventListener('change', async (event) =>
    {
        const specialityId = event.target.value;
        const medicalCenterId = medicalCenterSelect.value;

        setCalendar();
        clearSelects(["doctor", "eventTime"]);

        const url = `${API_BASE_URL}/catalog/doctors?centerId=${medicalCenterId}&specialtyId=${specialityId}`;
        const req = await fetch(url);
        const res = await req.json();

        if (res.error) {
            alert("Lo sentimos, no se encontraron médicos para esta especialidad");
            return;
        }

        for (const doctor of res) {
            const option = document.createElement("option");
            option.value = doctor.id;
            option.textContent = `${doctor.name} ${doctor.surname}`;
            doctorSelect.appendChild(option);
        }

        doctorSelect.disabled = false;
    });

    doctorSelect.addEventListener('change', (event) =>
    {
        const step = clover(true);
        setCalendar(step);
        clearSelects(["eventTime"]);
        calendar.dispatchEvent(new Event('change'));
    });

    calendar.addEventListener('change', async (event) =>
    {
        clearSelects(["eventTime"]);

        const day = event.target.value;

        const currentTime = greaterThanToday(day) ? null : pad(today.getHours()) + ":" + pad(today.getMinutes());
    
        const planner = generateTimeOptions("07:00", "12:30", "14:30", "21:00", 30, currentTime);

        for (let plan of planner) {
            const opt = document.createElement("option");
            opt.value = plan.value;
            opt.textContent = plan.label;
            hours.appendChild(opt);
        }

        hours.disabled = false;
    });

    hours.addEventListener('change', (event) =>{
        document.querySelector("#appointmentDate").value = calendar.value + "T" + event.target.value + "Z";
    });

    document.querySelector("#reserve form").addEventListener('submit', async (event) =>
    {
        event.preventDefault();

        const formData = new FormData(event.target);
        const formObj = Object.fromEntries(formData.entries());
        formObj.scheduleId = scheduleId();

        const { insuredId, countryISO, ...schedule } = formObj;

        const payload = {
            insuredId,
            countryISO,
            schedule
        };

        const req = await fetch(`${API_BASE_URL}/appointment`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });

        const res = await req.json();

        if (!res.error) {
            event.target.reset();
            reserveSection.classList.add("hidden");
            document.querySelector("#search").reset();
        }
        
        alert(res.message);
    });
});