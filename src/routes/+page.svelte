<script>
  import { onMount } from 'svelte';
  import { generateImage } from '$lib/replicate.ts';

  let address = '';
  let map;
  let marker;
  let lat = 40.7128; // Default latitude (e.g., New York)
  let lng = -74.0060; // Default longitude
  let autocompleteResults = [];
  let showResults = false;
  let occupants = 1;
  let area = 90;
  let renewable = 80;
  let imageUrl = '';
  let isLoading = false;
  let prompt = '';

  let climate = {
    temperature: 7.4,
    elevation: 825,
    humidity: 51,
    rainfall: 402
  };

  async function handleBuildClick() {
  isLoading = true;

  prompt = `Design a passive solar house with ${occupants} occupants, ${area}m², ${renewable}% renewable energy.
  Located at latitude ${lat.toFixed(2)}, longitude ${lng.toFixed(2)}.
  Elevation: ${climate.elevation}m, Temp: ${climate.temperature}°C, Humidity: ${climate.humidity}%.
  Use locally available materials and eco-friendly design.`;

  imageUrl = await generateImage(prompt);
}

  // Watch for address changes and fetch autocomplete suggestions
  $: if (address && address.length > 2) {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
      .then(res => res.json())
      .then(data => {
        autocompleteResults = data;
        showResults = true;
      });
  } else {
    autocompleteResults = [];
    showResults = false;
  }

  function selectSuggestion(suggestion) {
    address = suggestion.display_name;
    lat = parseFloat(suggestion.lat);
    lng = parseFloat(suggestion.lon);
    showResults = false;
    updateMap();
  }

  function updateMap() {
    if (map) {
      map.setView([lat, lng], 16);
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng], { draggable: true }).addTo(map);
        marker.on('dragend', onMarkerDrag);
      }
    }
  }

  function onMapClick(e) {
    lat = e.latlng.lat;
    lng = e.latlng.lng;
    if (marker) {
      marker.setLatLng(e.latlng);
    } else {
      marker = L.marker(e.latlng, { draggable: true }).addTo(map);
      marker.on('dragend', onMarkerDrag);
    }
    reverseGeocode(lat, lng);
  }

  function onMarkerDrag(e) {
    const pos = e.target.getLatLng();
    lat = pos.lat;
    lng = pos.lng;
    reverseGeocode(lat, lng);
  }

  function reverseGeocode(lat, lng) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.display_name) {
          address = data.display_name;
        }
      });
  }

  onMount(async () => {
    const L = await import('leaflet');
    await import('leaflet/dist/leaflet.css');

    map = L.map('map').setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    marker.on('dragend', onMarkerDrag);
    map.on('click', onMapClick);
  });
</script>

<h1 class="text-center py-5">Parametric House Generator</h1>

<div class="container my-5">
  <div class="row justify-content-center">
    <div class="col-12 col-lg-8">
      <div class="input-group input-group-lg shadow-sm rounded" style="background: #fff;">
        <input
          type="text"
          class="form-control border-0 rounded-start ps-4"
          placeholder="Search for an address or location..."
          bind:value={address}
          on:input={() => { showResults = true; }}
          autocomplete="off"
          style="background: transparent; box-shadow: none;"
        />
        <span class="input-group-text bg-transparent border-0 rounded-end pe-4">
          <i class="bi bi-search" style="font-size: 1.4rem; color: #495057;"></i>
        </span>
      </div>
      {#if showResults && autocompleteResults.length > 0}
        <div class="autocomplete-list mt-1">
          {#each autocompleteResults as result}
            <div class="autocomplete-item" on:click={() => selectSuggestion(result)}>
              {result.display_name}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>

<div class="container my-5">
  <div id="map" class="mx-auto"></div>
  <p>
    <strong>Selected Coordinates:</strong> {lat.toFixed(6)}, {lng.toFixed(6)}
  </p>
</div>

<div class="container my-5">
  <div class="row g-4">
    <!-- House Parameters Card -->
    <div class="col-md-4">
      <div class="card shadow-sm">
        <div class="card-body">
          <h4 class="card-title mb-4 text-success fw-bold">House Parameters</h4>
          <div>
            <i class="bi bi-person" style="font-size: 1.5rem;"></i>
            <span class="ms-2">Number of Occupants</span>
            <input type="range" min="1" max="10" bind:value={occupants} class="form-range mt-2" />
            <div class="text-end">{occupants}</div>
          </div>
          <div>
            <i class="bi bi-house-door" style="font-size: 1.5rem;"></i>
            <span class="ms-2">House Area (m²)</span>
            <input type="range" min="30" max="500" step="10" bind:value={area} class="form-range mt-2" />
            <div class="text-end">{area}</div>
          </div>
          <div>
            <i class="bi bi-sun-fill text-warning" style="font-size: 1.5rem;"></i>
            <span class="ms-2">Renewable Energy (%)</span>
            <input type="range" min="0" max="100" step="5" bind:value={renewable} class="form-range mt-2" />
            <div class="text-end">{renewable}%</div>
          </div>
        </div>
      </div>
    </div>
    <!-- Climate Data Card -->
    <div class="col-md-4">
      <div class="card shadow-sm">
        <div class="card-body">
          <h4 class="card-title mb-5 text-success fw-bold">Climate Data</h4>
          <div class="mb-3 d-flex align-items-center">
            <i class="bi bi-thermometer-half text-warning" style="font-size: 1.5rem;"></i>
            <span class="ms-3">Temperature</span>
            <span class="ms-auto fw-bold">{climate.temperature}°C</span>
          </div>
          <div class="mb-3 d-flex align-items-center">
            <i class="bi bi-triangle text-secondary" style="font-size: 1.5rem;"></i>
            <span class="ms-3">Elevation</span>
            <span class="ms-auto fw-bold">{climate.elevation} meters</span>
          </div>
          <div class="mb-3 d-flex align-items-center">
            <i class="bi bi-droplet-half text-primary" style="font-size: 1.5rem;"></i>
            <span class="ms-3">Humidity</span>
            <span class="ms-auto fw-bold">{climate.humidity}%</span>
          </div>
          <div class="d-flex align-items-center">
            <i class="bi bi-cloud-drizzle text-info" style="font-size: 1.5rem;"></i>
            <span class="ms-3">Annual Rainfall</span>
            <span class="ms-auto fw-bold">{climate.rainfall} mm</span>
          </div>
        </div>
      </div>
    </div>
  <div class="col-md-4">
    <div class="card shadow-sm">
      <div class="card-body">
        <h4 class="card-title mb-5 text-success fw-bold">Best Architecture Suggestion</h4>
        <div class="d-flex align-items-center mb-3">
          <i class="bi bi-lightbulb text-info" style="font-size: 1.5rem;"></i>
          <span class="ms-3">Recommended Design</span>
        </div>
        <div class="placeholder-glow mb-2" style="min-height: 3rem;">
          <!-- Placeholder for future API response -->
          <span class="placeholder col-12"></span>
        </div>
        <div class="text-muted small">
          The best architectural style for your parameters will appear here.
        </div>
      </div>
    </div>
  </div>

  </div>
</div>
 <!-- House Preview Card -->
<div class="container">
  <div class="card shadow-sm">
    <div class="card-body">
      <h4 class="card-title mb-4 text-success fw-bold">House Preview</h4>

      {#if imageUrl}
        <img src={imageUrl} class="img-fluid rounded mb-4" alt="Generated house preview" />
      {:else if isLoading}
        <div class="placeholder-glow mb-4" style="height: 300px;">
          <span class="placeholder col-12" style="height: 100%;"></span>
        </div>
      {:else}
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80"
          class="img-fluid rounded mb-4"
          alt="Default house preview" />
      {/if}

      <button class="btn btn-action-1 w-100 fw-bold"
        on:click={handleBuildClick}
        disabled={isLoading}>
        {isLoading ? 'Generating image...' : 'Build me a house'} <i class="bi bi-arrow-right ms-2"></i>
      </button>
    </div>
  </div>
</div>
