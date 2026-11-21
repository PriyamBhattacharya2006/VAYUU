import { a as bandOf, i as WHO, o as inhaledUg, p as timesGuideline, u as placeLabel } from "./parse-CVSYKet2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/guide-Bx2fWpQl.js
var MYTH = "Houseplants, salt lamps, and bowls of water do not clean PM2.5. Ozone and ionizer machines can irritate lungs. None of them replace a shut window during a peak, a hood that vents outside, or a real HEPA filter.";
function hourText(iso) {
	return iso.slice(11, 16);
}
function spanLabel(start, end, today) {
	return `${start.time.slice(0, 10) === today ? hourText(start.time) : `Tomorrow ${hourText(start.time)}`}–${hourText(end.time)}`;
}
function windowOf(hours, today, pick) {
	const span = Math.min(hours.length - 1, 23);
	let bestI = 0;
	let bestAvg = pick === "min" ? Infinity : -Infinity;
	const limit = Math.max(1, span);
	for (let i = 0; i < limit; i++) {
		const next = hours[Math.min(i + 1, hours.length - 1)];
		const avg = (hours[i].aqi + next.aqi) / 2;
		if (pick === "min" ? avg < bestAvg : avg > bestAvg) {
			bestAvg = avg;
			bestI = i;
		}
	}
	const end = hours[Math.min(bestI + 1, hours.length - 1)];
	const start = hours[bestI];
	return {
		label: start === end ? hourText(start.time) : spanLabel(start, end, today),
		aqi: Math.round(bestAvg === Infinity || bestAvg === -Infinity ? start.aqi : bestAvg),
		pm25: Math.round((start.pm25 + end.pm25) / 2)
	};
}
function vulnerable(profile) {
	return profile.sensitive || profile.children > 0 || profile.elders > 0 || profile.audience === "school";
}
function windPhrase(wind) {
	if (wind == null) return null;
	const shown = wind < 10 ? wind.toFixed(1) : String(Math.round(wind));
	if (wind < 5) return `nearly still (${shown} km/h)`;
	return `${shown} km/h`;
}
function leadFor(air, profile, best, worst, stagnant) {
	const bits = [`PM2.5 is ${Math.round(air.pm25)} µg/m³, ${timesGuideline(air.pm25, WHO.pm25)}.`];
	const wind = windPhrase(air.windKmh);
	if (stagnant && air.aqi > 80 && wind) bits.push(`Wind is ${wind}, too light to clear a winter inversion.`);
	else if (air.windKmh != null && air.windKmh >= 15 && air.aqi < 100 && wind) bits.push(`Wind is ${wind}, enough to mix the layer.`);
	if (worst.aqi - best.aqi >= 15) bits.push(`Lightest stretch ${best.label} (AQI ${best.aqi}); heaviest ${worst.label} (AQI ${worst.aqi}).`);
	else if (best.aqi >= 101) bits.push("The next 24 hours barely move.");
	if (best.aqi >= 151) bits.push("Even the lighter hours stay unhealthy. This is harm reduction, not an all-clear.");
	else if (best.aqi >= 101 && vulnerable(profile)) bits.push("The lighter hours are still hard on children, older adults, and sensitive lungs.");
	else if (air.aqi <= 50) bits.push("Outdoor air is in a good range. The useful work is not creating a dirty hour indoors.");
	return bits.slice(0, 4).join(" ");
}
function timingEntry(air, profile, best, worst, doseNow, doseBest) {
	const cut = doseNow > 0 ? Math.round((1 - doseBest / doseNow) * 100) : 0;
	const child = profile.children > 0 ? " A child breathes more for their size, so treat this as a floor, not their dose." : "";
	const still = best.aqi >= 151 ? " Either hour is still unhealthy." : "";
	const doseLine = cut < 8 ? `Timing barely changes the dose: about ${doseNow} µg now, ${doseBest} µg in the lighter stretch, for a 45-minute easy walk.${still}` : `Moving that walk to ${best.label} drops the rough dose from ${doseNow} µg to ${doseBest} µg, about ${cut}%.${still}`;
	let action;
	if (air.aqi <= 50 && best.aqi <= 80) action = "The day is forgiving. Ordinary errands don't need to be timed around the air.";
	else if (best.aqi >= 151 && cut < 12) action = `If someone has to be outside, ${best.label} is the least-bad stretch on this forecast, and it is still not a clean hour. Keep it short. ${worst.label} is the one to avoid.`;
	else action = `Put the outing that can move — a school run, a shop, a walk — at ${best.label}. Stay in around ${worst.label}.`;
	return {
		id: "timing",
		title: best.aqi >= 151 ? "There is no clean hour" : air.aqi <= 50 ? "No need to watch the clock" : "Move the outing, don't cancel the day",
		action,
		impact: `${doseLine} Rough adult model: 1.2 cubic metres of air in an hour of easy walking.${child}`
	};
}
function maskItem(air, profile) {
	const need = air.aqi >= 151 || air.aqi >= 101 && vulnerable(profile);
	const soft = air.aqi >= 101;
	if (!need && !soft) return null;
	return {
		score: need ? 96 : 78,
		item: {
			id: "mask",
			title: "A fitted FFP2 if anyone goes out",
			action: "Use an FFP2 or N95 with both straps and a pinched nose clip. Check for leaks at the cheeks. A cloth mask, or a surgical mask worn loose, does not stop most PM2.5.",
			impact: "A real seal can cut the particle dose of that outing by a large majority, often on the order of 80% or more. Gaps around the nose erase most of that. The mask does not shrink the exhaust the trip creates, and it does not stop carbon monoxide."
		}
	};
}
function windowsItem(air, profile, best) {
	if (air.aqi <= 80 && best.aqi <= 80) return {
		score: 62,
		item: {
			id: "windows",
			title: "Open the windows, except while cooking",
			action: "Outdoor air is the cleaner source today. Vent the home, and use a hood or a shut door only while something is frying, burning, or spraying.",
			impact: "On a cleaner day the indoor sources — cooking, incense, coils, sprays — are what raise the dose. Sending that plume outside is the whole trick."
		}
	};
	return {
		score: 92,
		item: {
			id: "windows",
			title: "Keep the polluted hour outside",
			action: `${profile.streetFacing ? "Street-facing windows " : "Windows "}should stay shut while the outdoor index is high.${best.aqi < 80 ? ` Keep them closed through the heavy hours, then air the room for about ten minutes at ${best.label}.` : " Leave them closed through the next day. Airing out into a peak just imports it."}${profile.purifier ? " Run the HEPA in the closed room where people sleep." : " Without a HEPA unit, a shut room only stays cleaner if frying, incense, and coils stay out of it."}`,
			impact: "With windows open, indoor particles track the street within a few hours. Closing them blocks that spike. It does not remove smoke made in the kitchen, and a HEPA filter does not remove carbon monoxide."
		}
	};
}
function cookingItem(profile, air) {
	const sealed = air.aqi >= 100;
	if (profile.cooking === "biomass") return {
		score: 99,
		item: {
			id: "cooking",
			title: "One meal off the smoky stove",
			action: sealed ? "Don't add a biomass fire to a room you can't air. Cook that meal on induction, or outside the living space with a real chimney, especially while the outdoor peak is on." : "Move the smoky meal outside the room people sit in, with a chimney that actually leaves the building. Induction for even one meal is the cleaner swap.",
			impact: "Solid-fuel cooking often pushes indoor PM2.5 into the hundreds of µg/m³ — more than a bad street — for the cook and for children nearby. That indoor hour can outweigh the commute."
		}
	};
	if (profile.cooking === "gas" || profile.cooking === "mixed") return {
		score: profile.cooking === "gas" ? 90 : 88,
		item: {
			id: "cooking",
			title: "Vent the gas, or skip the flame",
			action: sealed ? "Run a hood that vents outside from before you light the burner until ten minutes after. If the hood only recirculates, cook the frying on induction today so you aren't adding NO2 while the windows must stay shut." : "Hood on before the flame, lid on the pan, and no incense or mosquito coil in the same hour. The window can take the rest today.",
			impact: "An unvented gas burner is a main indoor source of nitrogen dioxide, and frying adds particles the outdoor forecast will never show. A recirculating hood does not send that outside."
		}
	};
	return {
		score: 52,
		item: {
			id: "cooking",
			title: "Don't add a fake freshener",
			action: "Induction is already the lower-emission cooktop. On a bad air day, skip incense, scented candles, and mosquito coils — they are indoor particle sources, not a remedy.",
			impact: "A coil or a stick of incense can dirty a room faster than the street outside, and no city forecast includes it. The stove you already have is not the problem."
		}
	};
}
function heatingItem(profile) {
	if (profile.heating === "solid") return {
		score: 98,
		item: {
			id: "heating",
			title: "Don't heat the room with an open flame",
			action: "Coal, wood, or dung burned in the living space is a larger dose than the street. Use electric heat or a stove that vents outside. Never sleep in a room with an unvented flame.",
			impact: "That fire fills the room with particles and carbon monoxide. A HEPA filter and a particle mask do not stop CO. For this home, the heater is the decision that matters most."
		}
	};
	if (profile.heating === "gas") return {
		score: 74,
		item: {
			id: "heating",
			title: "Keep the gas heater vented",
			action: "Do not run an unvented gas heater in a bedroom. If the choice tonight is an unvented flame or a colder room, electric heat is the one that doesn't add combustion gases on top of the smog.",
			impact: "Unvented gas adds nitrogen dioxide and carbon monoxide indoors. Those don't show up in the particle index on the street, and a PM2.5 mask does not stop them."
		}
	};
	return null;
}
function exerciseItem(profile, best, air) {
	if (!profile.outdoorExercise) return null;
	if (air.aqi >= 101 || best.aqi >= 101) return {
		score: 89,
		item: {
			id: "exercise",
			title: "Take the hard effort indoors",
			action: `${profile.audience === "school" ? "Outdoor play and PE" : "The run, the game, the long walk"} pulls in far more air than standing still. Move the hard session inside. If people must be out, keep it easy, short, and inside ${best.label} — with a fitted mask while the hour is still unhealthy.`,
			impact: "Dose is concentration times air breathed. Hard exercise can roughly triple the air an adult pulls in versus an easy walk, so it triples the particles from the same street."
		}
	};
	return {
		score: 55,
		item: {
			id: "exercise",
			title: "Outside is reasonable today",
			action: "A walk or a harder session outdoors fits this air. Prefer a side street over the busiest curb.",
			impact: "The concentration is modest, so a higher breathing rate still lands a smaller dose than the same workout on a smog day."
		}
	};
}
function commuteItem(profile) {
	if (profile.audience === "school") return {
		score: 87,
		item: {
			id: "commute",
			title: "End the idling line",
			action: "Ask drivers to arrive and cut the engine instead of waiting in a queue. Stagger the gate by a few minutes if the yard would otherwise stack cars.",
			impact: "A line of idling engines builds a plume exactly where children stand, at tailpipe height. That cloud is local — it will not match the city index — and it is the air they breathe. A typical 8 km urban petrol round trip is also about 1.4 kg of CO2, at roughly 170 g/km. That is a fleet average, not a reading from one car."
		}
	};
	if (profile.commute === "car") return {
		score: 86,
		item: {
			id: "commute",
			title: "One less cold start",
			action: "Combine the trips that can share a ride, and switch the engine off at the gate. Recirculate the cabin while you're in dense traffic, then open it once you leave the plume.",
			impact: "Skipping one 8 km urban petrol round trip avoids roughly 1.4 kg of CO2 (about 170 g/km, a typical car, not a measurement of yours) and keeps a tailpipe away from the door. The cabin still sits in traffic exhaust until the air intake is on recirculate."
		}
	};
	if (profile.commute === "remote") return {
		score: 64,
		item: {
			id: "commute",
			title: "Don't spend the day you already saved",
			action: "Staying off the road is the low-emission choice. Don't hand it back as a string of separate delivery trips. Batch the errand that still needs a vehicle.",
			impact: "A short urban petrol hop of about 8 km is roughly 1.4 kg of CO2 at 170 g/km, and the curb where it stops gets the exhaust. Fewer departures cut both."
		}
	};
	const mode = profile.commute === "cycle" ? "cycling" : profile.commute === "walk" ? "walking" : "the bus or train";
	return {
		score: 70,
		item: {
			id: "commute",
			title: profile.commute === "transit" ? "Wait inside, not on the curb" : "Keep the quiet route",
			action: profile.commute === "transit" ? "The ride is already the lower-emission trip. Wait indoors rather than on the traffic edge, and step out when the vehicle is there." : `You are ${mode}, so you are not adding a tailpipe. Use a side street rather than the arterial, and the lighter hour if the index is high.`,
			impact: profile.commute === "transit" ? "The curb beside idling buses and cars is often dirtier than the citywide number. Minutes there are a real slice of the day's dose. The ride itself still beats a private car on emissions for the same distance." : "You avoid the roughly 1.4 kg of CO2 of an 8 km urban petrol round trip, and you still breathe the street. Route and hour decide the dose; the mask decides how much of it lands."
		}
	};
}
function purifierItem(profile, air) {
	if (!profile.purifier || air.aqi < 80) return null;
	return {
		score: 84,
		item: {
			id: "purifier",
			title: "One closed room, filter on",
			action: "Run the HEPA in the room people actually sleep in, door shut, through the heavy hours and overnight. A unit too small for that room will look busy and do little.",
			impact: "A right-sized HEPA can cut PM2.5 in a closed room by half or more within an hour. It does not remove carbon monoxide, and it does not clean the kitchen while the door is open."
		}
	};
}
function togetherItem(profile) {
	if (profile.audience === "school") return {
		id: "together",
		title: "Tell families the hour, once",
		action: "Send one note: the lighter stretch, the mask if the hour is still unhealthy, and the request to cut engines at the gate. Move outdoor play off the heaviest hours.",
		impact: "A hundred small trips timed to the same dirty hour stack the dose and the exhaust. One shared hour, and no idle line, changes the air children actually stand in."
	};
	if (profile.audience === "neighborhood") return {
		id: "together",
		title: "A bad-day agreement on the block",
		action: "No trash or leaf fires while the index is unhealthy. Share the lighter hour. If older neighbors heat with solid fuel, offer one cleaner room — a hall, a library, a shop that already runs a filter.",
		impact: "A street fire is a spike the city model averages away, at breathing height. A block that doesn't burn protects the people on it. That is the exposure you can actually change."
	};
	return {
		id: "together",
		title: "One ask of the street",
		action: "Skip leaf, trash, and roadside burning, and say that to whoever usually lights it. Engines off while waiting outside a gate or a shop.",
		impact: "One burn or a row of idling cars is a local cloud the regional index will miss. It is still the air at the door, especially for a child at tailpipe height."
	};
}
function profileLine(profile) {
	return [
		profile.audience === "family" ? "Family home" : profile.audience === "school" ? "School or daycare" : "Neighborhood group",
		`${profile.adults} adults, ${profile.children} children, ${profile.elders} older people`,
		profile.sensitive ? "someone pregnant or with asthma, heart, or lung disease" : "no one flagged as medically sensitive",
		`getting around: ${profile.commute}`,
		`cooking: ${profile.cooking}`,
		`heating: ${profile.heating}`,
		profile.streetFacing ? "windows face a busy road" : "windows do not face a busy road",
		profile.purifier ? "HEPA purifier in the main room" : "no HEPA purifier",
		profile.outdoorExercise ? "outdoor exercise or play is part of the day" : "no regular outdoor workout"
	].join("; ");
}
function buildGuide(air, profile) {
	const today = air.observedAt.slice(0, 10);
	const hours = air.hours.length > 0 ? air.hours : [{
		time: air.observedAt,
		aqi: air.aqi,
		pm25: Math.round(air.pm25)
	}];
	const best = windowOf(hours, today, "min");
	const worst = windowOf(hours, today, "max");
	const doseNow = inhaledUg(air.pm25);
	const doseBest = inhaledUg(best.pm25);
	const stagnant = (air.windKmh ?? 99) < 5;
	const scored = [{
		score: air.aqi >= 101 || worst.aqi - best.aqi >= 15 ? 100 : 74,
		item: timingEntry(air, profile, best, worst, doseNow, doseBest)
	}];
	const mask = maskItem(air, profile);
	if (mask) scored.push(mask);
	scored.push(windowsItem(air, profile, best));
	const cooking = cookingItem(profile, air);
	if (cooking) scored.push(cooking);
	const heating = heatingItem(profile);
	if (heating) scored.push(heating);
	const exercise = exerciseItem(profile, best, air);
	if (exercise) scored.push(exercise);
	scored.push(commuteItem(profile));
	const purifier = purifierItem(profile, air);
	if (purifier) scored.push(purifier);
	scored.sort((a, b) => b.score - a.score);
	const items = scored.filter((row) => row.score >= 50).slice(0, 6).map((row) => row.item);
	return {
		lead: leadFor(air, profile, best, worst, stagnant),
		items,
		together: togetherItem(profile),
		myth: MYTH,
		best,
		worst,
		doseNow,
		doseBest,
		stagnant
	};
}
function factSheet(air, profile, guide) {
	const extra = [];
	if (air.pm10 != null) extra.push(`PM10: ${Math.round(air.pm10)} µg/m³ (${timesGuideline(air.pm10, WHO.pm10)})`);
	if (air.no2 != null) extra.push(`NO2: ${Math.round(air.no2)} µg/m³ (${timesGuideline(air.no2, WHO.no2)})`);
	if (air.o3 != null) extra.push(`Ozone: ${Math.round(air.o3)} µg/m³ (WHO peak-season guideline 100)`);
	if (air.so2 != null) extra.push(`SO2: ${Math.round(air.so2)} µg/m³ (${timesGuideline(air.so2, WHO.so2)})`);
	if (air.co != null) extra.push(`CO: ${(air.co / 1e3).toFixed(1)} mg/m³ (WHO daily guideline 4 mg/m³)`);
	const weather = [
		air.temperatureC != null ? `${air.temperatureC.toFixed(1)}°C` : null,
		air.humidity != null ? `${Math.round(air.humidity)}% humidity` : null,
		air.windKmh != null ? `wind ${air.windKmh < 10 ? air.windKmh.toFixed(1) : Math.round(air.windKmh)} km/h` : null
	].filter(Boolean).join(", ");
	return [
		`Place: ${placeLabel(air.place)}`,
		`Local time: ${air.observedAt} (${air.timezone})`,
		`Weather: ${weather || "unavailable"}`,
		`US AQI now: ${air.aqi} (${bandOf(air.aqi).label})`,
		`PM2.5 now: ${Math.round(air.pm25)} µg/m³ (${timesGuideline(air.pm25, WHO.pm25)}; WHO daily guideline is 15 µg/m³)`,
		...extra,
		`Household: ${profileLine(profile)}`,
		`Lightest 2-hour stretch in the next 24h: ${guide.best.label}, average AQI ${guide.best.aqi}, PM2.5 about ${guide.best.pm25} µg/m³`,
		`Heaviest 2-hour stretch: ${guide.worst.label}, average AQI ${guide.worst.aqi}, PM2.5 about ${guide.worst.pm25} µg/m³`,
		`Rough inhaled PM2.5, 45-minute easy walk, adult at 1.2 m³/hour: ${guide.doseNow} µg at the current hour, ${guide.doseBest} µg in the lightest stretch.`,
		`Typical 8 km urban petrol round trip: about 1.4 kg CO2 at 170 g/km. Fleet average, not their car.`,
		`Guide already on screen: ${guide.lead}`,
		`Actions already on screen: ${guide.items.map((item) => item.title).join("; ")}`,
		"Next hours, local time:",
		...air.hours.slice(0, 24).map((hour) => `${hour.time.slice(0, 16).replace("T", " ")} AQI ${hour.aqi} PM2.5 ${hour.pm25}`)
	].join("\n");
}
//#endregion
export { factSheet as n, buildGuide as t };
