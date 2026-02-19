
import { SublimeEditor } from '../../Content/SublimeEditor';

export const MobileAbout = () => {
    // Reuse SublimeEditor but wrapper in a mobile-friendly container
    // maybe force read-only or different styling if possible via props, 
    // but SublimeEditor seems to be stateful.

    // Actually, let's just use it directly, it adapts well enough if width is 100%.
    // We just need to ensure it fits the screen height.

    return (
        <div className="w-full h-full flex flex-col bg-[#272822]">
            {/* We can add a mobile header or just let the editor be full screen */}
            <SublimeEditor fileId="about-mobile" fileName="About_Me.java" initialContent={`
package com.maycon.about;

public class AboutMe {

    public static void main(String[] args) {
        Engineer maycon = new Engineer();
        
        maycon.setName("Maycon Pereira");
        maycon.setRole("Software Engineer");
        maycon.setFocus("Backend & Architecture");
        
        // Passionate about building robust systems
        // and clean, efficient code.
        
        System.out.println(maycon.getBio());
    }

    /*
     * Experienced in designing scalable
     * microservices and solving complex
     * problems with Java/Spring ecosystem.
     */
}
`} />
        </div>
    );
};
