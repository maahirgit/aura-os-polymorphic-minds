#include <iostream>
#include <vector>
#include <limits>
using namespace std;

#include "../src/core/KioskCore.h"
#include "../src/patterns/strategy/StandardPricing.h"
#include "../src/patterns/state/ActiveState.h"
#include "../src/inventory/InventorySystem.h"
#include "../src/payment/PaymentSystem.h"

int main() {

    int role;
    cout << "Select Role:\n1. Admin\n2. User\nEnter: ";
    cin >> role;

    int typeChoice;
    string systemType;

    cout << "\nSelect System Type:\n";
    cout << "1. Hospital\n2. Metro\n3. University\nEnter: ";
    cin >> typeChoice;

    if(typeChoice == 1) systemType = "hospital";
    else if(typeChoice == 2) systemType = "metro";
    else systemType = "university";

    InventorySystem inventory(systemType);
    KioskCore kiosk;
    PaymentSystem payment;

    vector<string> history;

    int choice;

    do {

        cout << "\n========= MENU =========\n";

        // ================= ADMIN =================
        if(role == 1) {

            cout << "ADMIN MODE\n";
            cout << "1. View Items\n";
            cout << "2. Add Item\n";
            cout << "3. Exit\n";

            cout << "Enter choice: ";
            cin >> choice;

            if(choice == 1) {
                inventory.displayItems();
            }

            else if(choice == 2) {
                string item;
                int quantity, price;

                cout << "Enter item name: ";
                cin >> item;

                cout << "Enter quantity: ";
                cin >> quantity;

                cout << "Enter price: ";
                cin >> price;

                inventory.addItem(item, quantity, price);

                cout << "Item added successfully!\n";
            }
        }

        // ================= USER =================
        else {

            cout << "USER MODE\n";
            cout << "1. View Items\n";
            cout << "2. Buy Item\n";
            cout << "3. View History\n";
            cout << "4. Exit\n";

            cout << "Enter choice: ";
            cin >> choice;

            // 🔥 THIS IS THE IMPORTANT FIX
            if(choice == 1) {
                inventory.displayItems();
            }

            else if(choice == 2) {

                cout << "Entering BUY section...\n";  // DEBUG

                string item;
                int quantity;

                inventory.displayItems();

                cin.ignore(numeric_limits<streamsize>::max(), '\n');

                // ITEM INPUT
                while(true) {
                    cout << "\nEnter item name: ";
                    getline(cin, item);

                    if(inventory.isAvailable(item))
                        break;

                    cout << "Item NOT Available. Try again.\n";
                }

                cout << "Enter quantity: ";
                cin >> quantity;

                if(inventory.getStock(item) < quantity) {
                    cout << "Not enough stock!\n";
                    continue;
                }

                int price = inventory.getPrice(item);

                kiosk.setState(new ActiveState());
                kiosk.setPricingStrategy(new StandardPricing());

                cout << "\n========== PROCESSING ==========\n";

                kiosk.processOrder(price * quantity);
                payment.processPayment(price * quantity);

                inventory.reduceStock(item, quantity);

                cout << "\n========= BILL =========\n";
                cout << "Item: " << item << endl;
                cout << "Quantity: " << quantity << endl;
                cout << "Total: " << price * quantity << endl;
                cout << "========================\n";

                history.push_back(item);
            }

            else if(choice == 3) {
                cout << "\nTransaction History:\n";
                for(string h : history)
                    cout << "- " << h << endl;
            }
        }

    } while((role == 1 && choice != 3) || (role == 2 && choice != 4));

    cout << "\nSystem Closed.\n";
    return 0;
}
