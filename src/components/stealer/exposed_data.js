import {useState} from "react";

function ExposedData({entry}) {
    const [copied, setCopied] = useState("");

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(""), 1200);
    };

    return (
        <td className="py-4 px-6">
            <div className="space-y-2">
                {/* Identity */}
                <div
                    className="flex items-center cursor-pointer group relative"
                    title="Click to copy identity"
                    onClick={() => handleCopy(entry.email, "identity")}
                >
                  <span className="text-xs bg-gradient-to-r from-green-600 to-green-800 px-2 py-1 rounded mr-2">
                    📧 identity
                  </span>
                    <span className="group-hover:text-green-300 transition-colors">
                    {entry.email}
                  </span>
                    {copied === "identity" && (
                        <span
                            className="absolute left-full ml-2 px-2 py-1 text-xs bg-black/80 text-white rounded shadow-lg z-10 animate-fade-in-up">
                      Copied!
                    </span>
                    )}
                </div>
                {/* Password */}
                <div
                    className="flex items-center cursor-pointer group relative"
                    title="Click to copy password"
                    onClick={() => handleCopy(entry.password, "password")}
                >
                  <span className="text-xs bg-gradient-to-r from-purple-600 to-purple-800 px-2 py-1 rounded mr-2">
                    🗝️ pass
                  </span>
                    <span className="group-hover:text-purple-300 transition-colors">
                    {entry.password}
                  </span>
                    {copied === "password" && (
                        <span
                            className="absolute left-full ml-2 px-2 py-1 text-xs bg-black/80 text-white rounded shadow-lg z-10 animate-fade-in-up">
              Copied!
            </span>
                    )}
                </div>
                {/* Origin */}
                <div
                    className="flex items-center cursor-pointer group"
                    title="Go to origin"
                    onClick={() => {
                        if (entry.origin) {
                            let url = entry.origin;
                            if (!/^https?:\/\//i.test(url)) {
                                url = "https://" + url;
                            }
                            window.open(url, "_blank");
                        }
                    }}
                >
          <span className="text-xs bg-gradient-to-r from-blue-600 to-blue-800 px-2 py-1 rounded mr-2">
            🌐 origin
          </span>
                    <span className="group-hover:text-blue-300 transition-colors underline">
            <DomainList domainsString={entry.origin} limit={3}/>
          </span>
                </div>
            </div>
        </td>
    );
}


const DomainList = ({domainsString, limit = 3}) => {
    // Pisahkan string jadi array
    const domains = domainsString
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);
    const [showAll, setShowAll] = useState(false);

    if (domains.length === 0) return <span>-</span>;

    return (
        <span>
      {showAll
          ? domains.join(", ")
          : domains.slice(0, limit).join(", ") +
          (domains.length > limit ? ", ..." : "")}
            {domains.length > limit && (
                <button
                    onClick={() => setShowAll((prev) => !prev)}
                    className="ml-2 text-blue-400 hover:underline focus:outline-none text-xs"
                >
                    {showAll ? "Read Less" : "Read More"}
                </button>
            )}
    </span>
    );
};


export default ExposedData;