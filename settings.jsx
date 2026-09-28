import { React, ReactNative } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import {
	ScrollView,
	Stack,
	TableRowGroup,
	TableSwitchRow,
	TextInput,
} from "../../common/ui/TableComponents.js";
import { findByProps } from "@vendetta/metro";

const { View, Text } = ReactNative;
const { Slider } = findByProps("Slider") || {};
const { Card } = findByProps("Card") || {};

const updateStorage = (path, finalVal) => {
	const keys = path.split(".");
	let current = storage;
	for (let i = 0; i < keys.length - 1; i++) {
		current = current[keys[i]];
	}
	current[keys[keys.length - 1]] = finalVal;
};

const SettingCardSlider = ({ label, path, max = 1 }) => {
	const keys = path.split(".");
	let initialVal = storage;
	for (const key of keys) initialVal = initialVal?.[key] ?? 1;

	const [localText, setLocalText] = React.useState(String(initialVal));

	const handleTextChange = (text) => {
		setLocalText(text);
		if (text === "" || text.endsWith(".") || text.endsWith("0")) return;
		const parsed = parseFloat(text);
		if (!Number.isNaN(parsed)) {
			updateStorage(path, parsed);
		}
	};

	const handleSliderChange = (val) => {
		const rounded = parseFloat(val.toFixed(3));
		setLocalText(String(rounded));
		updateStorage(path, rounded);
	};

	const content = (
		<View style={{ padding: 0, gap: 12 }}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<Text
					variant="heading-md/semibold"
					style={{ color: "#dbdee1", flexShrink: 1 }}
				>
					{label}
				</Text>
				<View style={{ width: 80 }}>
					<TextInput
						placeholder="1.0"
						value={localText}
						onChangeText={handleTextChange}
						keyboardType="numeric"
						size="sm"
					/>
				</View>
			</View>
			{Slider && (
				<Slider
					value={parseFloat(localText) || 0}
					minimumValue={0}
					maximumValue={max}
					step={0.005}
					onValueChange={handleSliderChange}
				/>
			)}
		</View>
	);

	if (Card) {
		return <Card>{content}</Card>;
	}

	return (
		<View
			style={{
				backgroundColor: "#2b2d31",
				borderRadius: 16,
				overflow: "hidden",
			}}
		>
			{content}
		</View>
	);
};

export default function Settings() {
	useProxy(storage);

	if (!storage.settings) {
		storage.settings = {
			choomMultiplier: 1,
			gonkMultiplier: 1,
			convert_messages: true,
		};
	}

	return (
		<ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 12 }}>
			<Stack spacing={12}>
				<TableRowGroup title="Edgerunner Slang Frequencies">
					<Stack spacing={8}>
						<SettingCardSlider
							label="Choom Frequency"
							path="settings.choomMultiplier"
						/>
						<SettingCardSlider
							label="Gonk Frequency"
							path="settings.gonkMultiplier"
						/>
					</Stack>
				</TableRowGroup>
				<TableRowGroup title="System Protocols">
					<TableSwitchRow
						label="Auto-patch outgoing comms"
						value={storage.settings.convert_messages}
						onValueChange={(v) => {
							updateStorage("settings.convert_messages", v);
						}}
					/>
				</TableRowGroup>
			</Stack>
		</ScrollView>
	);
}
