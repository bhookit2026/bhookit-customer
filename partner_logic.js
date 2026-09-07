// Partner Registration Logic
function openInvitePartnerModal() {
  openModal('invitePartnerModal');
}

function sendInvite() {
  const email = document.getElementById('inviteEmail').value;
  if (!email) {
    showToast('Please enter an email address', 'error');
    return;
  }
  closeModal('invitePartnerModal');
  showToast(`Registration link sent to ${email}`, 'success');
  
  // Show mock notification to simulate email received
  const msg = `Click here to register your restaurant: <a href="#" onclick="closeModal('mockNotificationModal'); show('partnerRegistration')">Partner Registration Form</a>`;
  showMockNotification('Email', email, msg, '');
}

function submitPartnerRegistration(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.restName.value;
  const phone = form.restPhone.value;
  const address = form.restAddress.value;
  const docs = form.restDocs.value;
  
  const newRest = {
    id: Date.now(),
    name: name,
    rating: 0,
    deliveryTime: '30-45 mins',
    fssai: 'Pending',
    hygiene: 'N/A',
    minOrder: 100,
    approved: false, // Pending approval
    open: false,
    coverImg: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    foods: []
  };
  
  appData.restaurants.push(newRest);
  saveState();
  
  form.reset();
  showToast('Registration submitted! Awaiting Admin Approval.', 'success');
  
  // Go back to main
  show('explore');
}

function showMockNotification(type, to, message, link) {
  document.getElementById('mockNotifType').innerText = type + ' Notification';
  document.getElementById('mockNotifTo').innerText = to;
  document.getElementById('mockNotifMsg').innerHTML = message;
  
  const btn = document.getElementById('mockNotifAction');
  if (link) {
    btn.style.display = 'inline-block';
    btn.onclick = () => {
      closeModal('mockNotificationModal');
      // Set role to vendor and show vendor portal if applicable
      appData.currentUser.role = 'vendor';
      saveState();
      show('vendor');
    };
  } else {
    btn.style.display = 'none';
  }
  
  openModal('mockNotificationModal');
}
