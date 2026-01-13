interface TranscribeAudioAssetParams {
  assetId: number;
}

export async function transcribeAsset(params: TranscribeAudioAssetParams) {
  const response = await fetch("/api/stt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to transcribe audio asset ${errorText}`);
  }

  return response.json();
}
