import StyleFollowList from "./StyleFollowList";

export default function StyleFollowListPage() {
  const params = new URLSearchParams(window.location.search);
  const userid = params.get("userid");
  const type = params.get("type");

  return (
    <StyleFollowList
      open={true}
      onClose={() => window.close()}
      userid={userid}
      type={type}
      onFollowChange={handleFollowToggle}
    />
  );
}