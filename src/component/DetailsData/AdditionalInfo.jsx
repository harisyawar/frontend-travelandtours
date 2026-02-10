// AdditionalInfo.jsx
export default function AdditionalInfo({ info }) {
  return (
    <div className=" py-4">
      <h3 className="font-bold  text-3xl  mb-2 ">Additional Information</h3>

      <ul className="list-disc ml-4 mr-3 space-y-1">
        {info.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
