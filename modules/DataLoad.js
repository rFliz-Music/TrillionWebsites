export let DATA = {};

export async function load_data() {
  console.log("Fetching DATA")
  const res = await fetch('./modules/app_data.json');  
  DATA = await res.json();
  console.log("data loaded")  
}